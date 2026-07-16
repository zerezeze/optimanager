"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuthenticated, canAccessClient, canAccessConsultation } from "@/lib/authz";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

const esfericoCilindricoRegex = /^(PLANO|[+-]?\d+([.,]\d+)?)$/i;
const numericWithDecimalsRegex = /^\d+([.,]\d{1,2})?$/;

const consultationSchema = z.object({
  data: z.string().optional().or(z.literal("")),
  adicao: z.string().trim().max(50, "Adição deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  lentes: z.string().trim().max(255, "Lentes deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  laboratorio: z.string().trim().max(255, "Laboratório deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  valor: z.string().trim().min(1, "O valor é obrigatório"),
  observacao: z.string().trim().optional().or(z.literal("")),
  ordemServico: z.string().trim().max(100, "Ordem de serviço deve ter no máximo 100 caracteres").optional().or(z.literal("")),

  // Novos campos refrativos OD
  odEsferico: z.string().trim().refine(val => val === "" || esfericoCilindricoRegex.test(val), "Esférico OD inválido (Ex: +2,00, -1,75, PLANO)").optional().or(z.literal("")),
  odCilindrico: z.string().trim().refine(val => val === "" || esfericoCilindricoRegex.test(val), "Cilíndrico OD inválido (Ex: -0,50, PLANO)").optional().or(z.literal("")),
  odEixo: z.string().trim().refine(val => {
    if (val === "") return true;
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 180 && String(parsed) === val;
  }, "Eixo OD deve ser um número inteiro entre 0 e 180").optional().or(z.literal("")),
  odDnp: z.string().trim().refine(val => val === "" || numericWithDecimalsRegex.test(val), "DNP OD deve ser numérico com até 2 casas decimais").optional().or(z.literal("")),
  odAltura: z.string().trim().refine(val => val === "" || numericWithDecimalsRegex.test(val), "Altura OD deve ser numérica com até 2 casas decimais").optional().or(z.literal("")),

  // Novos campos refrativos OE
  oeEsferico: z.string().trim().refine(val => val === "" || esfericoCilindricoRegex.test(val), "Esférico OE inválido (Ex: +2,00, -1,75, PLANO)").optional().or(z.literal("")),
  oeCilindrico: z.string().trim().refine(val => val === "" || esfericoCilindricoRegex.test(val), "Cilíndrico OE inválido (Ex: -0,50, PLANO)").optional().or(z.literal("")),
  oeEixo: z.string().trim().refine(val => {
    if (val === "") return true;
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 180 && String(parsed) === val;
  }, "Eixo OE deve ser um número inteiro entre 0 e 180").optional().or(z.literal("")),
  oeDnp: z.string().trim().refine(val => val === "" || numericWithDecimalsRegex.test(val), "DNP OE deve ser numérico com até 2 casas decimais").optional().or(z.literal("")),
  oeAltura: z.string().trim().refine(val => val === "" || numericWithDecimalsRegex.test(val), "Altura OE deve ser numérica com até 2 casas decimais").optional().or(z.literal("")),
});

const VALID_PAYMENT_METHODS: PaymentMethod[] = [
  "DINHEIRO",
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "CREDIARIO",
];

function parseBRLValueToCents(valStr: string): number {
  let clean = valStr.trim();
  clean = clean.replace(/\s/g, "");
  
  if (clean.includes(",")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  }
  
  const parsed = parseFloat(clean);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error("O valor financeiro informado é inválido.");
  }
  
  return Math.round(parsed * 100);
}

/**
 * Builds Payment + Installment data objects from formData.
 * Returns null if operator chose not to register payment.
 */
function buildPaymentData(
  formData: FormData,
  valorTotalCentavos: number
): null | {
  method: PaymentMethod;
  status: PaymentStatus;
  totalPago: number;
  installments: Array<{ numero: number; valor: number; vencimento: Date }>;
} {
  const registerPayment = formData.get("registerPayment");
  if (registerPayment !== "true") return null;

  const rawMethod = (formData.get("paymentMethodValue") as string)?.trim();
  if (!rawMethod || !VALID_PAYMENT_METHODS.includes(rawMethod as PaymentMethod)) {
    throw new Error("Método de pagamento inválido.");
  }
  const method = rawMethod as PaymentMethod;

  if (method !== "CREDIARIO") {
    // À vista: fully paid
    return { method, status: "PAGO", totalPago: valorTotalCentavos, installments: [] };
  }

  // Crediário
  const rawEntrada = (formData.get("paymentEntrada") as string) || "0";
  let entradaCentavos = 0;
  try {
    entradaCentavos = rawEntrada.trim() === "" || rawEntrada === "0" || rawEntrada === "0,00"
      ? 0
      : parseBRLValueToCents(rawEntrada);
  } catch {
    throw new Error("Valor de entrada inválido.");
  }

  if (entradaCentavos > valorTotalCentavos) {
    throw new Error("Valor de entrada não pode ser maior que o valor total da venda.");
  }

  const numeroParcelas = parseInt(formData.get("paymentNumeroParcelas") as string, 10) || 2;
  if (numeroParcelas < 1 || numeroParcelas > 24) {
    throw new Error("Número de parcelas deve ser entre 1 e 24.");
  }

  const restante = valorTotalCentavos - entradaCentavos;
  const valorParcela = Math.floor(restante / numeroParcelas);
  const diferenca = restante - valorParcela * numeroParcelas; // distribuir centavos residuais

  const installments: Array<{ numero: number; valor: number; vencimento: Date }> = [];
  const hoje = new Date();

  for (let i = 1; i <= numeroParcelas; i++) {
    const vencimento = new Date(hoje);
    vencimento.setMonth(vencimento.getMonth() + i);
    vencimento.setHours(0, 0, 0, 0);

    // Add any residual cents to the last installment
    const valor = i === numeroParcelas ? valorParcela + diferenca : valorParcela;
    installments.push({ numero: i, valor, vencimento });
  }

  const status: PaymentStatus = entradaCentavos > 0 ? "PARCIAL" : "PENDENTE";

  return { method, status, totalPago: entradaCentavos, installments };
}

export async function createConsultation(clientId: string, formData: FormData) {
  await requireAuthenticated();

  // Validate UUID format of clientId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(clientId)) {
    throw new Error("Cliente inválido.");
  }

  // Authorize user has access to the target client
  const hasAccess = await canAccessClient(clientId);
  if (!hasAccess) {
    throw new Error("Acesso negado. Você não tem permissão para cadastrar consultas para este cliente.");
  }

  const rawData = {
    data: formData.get("data"),
    adicao: formData.get("adicao"),
    lentes: formData.get("lentes"),
    laboratorio: formData.get("laboratorio"),
    valor: formData.get("valor"),
    observacao: formData.get("observacao"),
    ordemServico: formData.get("ordemServico"),
    odEsferico: formData.get("odEsferico"),
    odCilindrico: formData.get("odCilindrico"),
    odEixo: formData.get("odEixo"),
    odDnp: formData.get("odDnp"),
    odAltura: formData.get("odAltura"),
    oeEsferico: formData.get("oeEsferico"),
    oeCilindrico: formData.get("oeCilindrico"),
    oeEixo: formData.get("oeEixo"),
    oeDnp: formData.get("oeDnp"),
    oeAltura: formData.get("oeAltura"),
  };

  const validation = consultationSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const {
    data,
    adicao,
    lentes,
    laboratorio,
    valor,
    observacao,
    ordemServico,
    odEsferico,
    odCilindrico,
    odEixo,
    odDnp,
    odAltura,
    oeEsferico,
    oeCilindrico,
    oeEixo,
    oeDnp,
    oeAltura,
  } = validation.data;

  let valorEmCentavos: number;
  try {
    valorEmCentavos = parseBRLValueToCents(valor);
  } catch (err: any) {
    throw new Error(err.message);
  }

  let dataConsulta = new Date();
  if (data) {
    const parsedDate = new Date(data);
    if (!isNaN(parsedDate.getTime())) {
      dataConsulta = parsedDate;
    }
  }

  // Parse payment data (optional)
  let paymentData: ReturnType<typeof buildPaymentData> = null;
  try {
    paymentData = buildPaymentData(formData, valorEmCentavos);
  } catch (err: any) {
    throw new Error(err.message);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.create({
        data: {
          clientId,
          data: dataConsulta,
          adicao: adicao || null,
          lentes: lentes || null,
          laboratorio: laboratorio || null,
          valor: valorEmCentavos,
          observacao: observacao || null,
          ordemServico: ordemServico || null,
          odEsferico: odEsferico || null,
          odCilindrico: odCilindrico || null,
          odEixo: odEixo || null,
          odDnp: odDnp || null,
          odAltura: odAltura || null,
          oeEsferico: oeEsferico || null,
          oeCilindrico: oeCilindrico || null,
          oeEixo: oeEixo || null,
          oeDnp: oeDnp || null,
          oeAltura: oeAltura || null,
        },
      });

      if (paymentData) {
        await tx.payment.create({
          data: {
            consultationId: consultation.id,
            method: paymentData.method,
            status: paymentData.status,
            totalPago: paymentData.totalPago,
            installments: paymentData.installments.length > 0
              ? { create: paymentData.installments }
              : undefined,
          },
        });
      }
    });
  } catch (error) {
    console.error("Prisma createConsultation error:", error);
    throw new Error("Ocorreu um erro ao salvar a consulta no banco de dados.");
  }

  revalidatePath(`/clientes/${clientId}`);
  redirect(`/clientes/${clientId}`);
}

export async function updateConsultation(id: string, formData: FormData) {
  await requireAuthenticated();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Identificador de consulta inválido.");
  }

  // Authorize user has access to this consultation
  const hasAccess = await canAccessConsultation(id);
  if (!hasAccess) {
    throw new Error("Acesso negado. Você não tem permissão para alterar esta consulta.");
  }

  const rawData = {
    data: formData.get("data"),
    adicao: formData.get("adicao"),
    lentes: formData.get("lentes"),
    laboratorio: formData.get("laboratorio"),
    valor: formData.get("valor"),
    observacao: formData.get("observacao"),
    ordemServico: formData.get("ordemServico"),
    odEsferico: formData.get("odEsferico"),
    odCilindrico: formData.get("odCilindrico"),
    odEixo: formData.get("odEixo"),
    odDnp: formData.get("odDnp"),
    odAltura: formData.get("odAltura"),
    oeEsferico: formData.get("oeEsferico"),
    oeCilindrico: formData.get("oeCilindrico"),
    oeEixo: formData.get("oeEixo"),
    oeDnp: formData.get("oeDnp"),
    oeAltura: formData.get("oeAltura"),
  };

  const validation = consultationSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const {
    data,
    adicao,
    lentes,
    laboratorio,
    valor,
    observacao,
    ordemServico,
    odEsferico,
    odCilindrico,
    odEixo,
    odDnp,
    odAltura,
    oeEsferico,
    oeCilindrico,
    oeEixo,
    oeDnp,
    oeAltura,
  } = validation.data;

  let valorEmCentavos: number;
  try {
    valorEmCentavos = parseBRLValueToCents(valor);
  } catch (err: any) {
    throw new Error(err.message);
  }

  let dataConsulta = new Date();
  if (data) {
    const parsedDate = new Date(data);
    if (!isNaN(parsedDate.getTime())) {
      dataConsulta = parsedDate;
    }
  }

  // Parse payment data (optional – upsert if provided)
  let paymentData: ReturnType<typeof buildPaymentData> = null;
  try {
    paymentData = buildPaymentData(formData, valorEmCentavos);
  } catch (err: any) {
    throw new Error(err.message);
  }

  let clientId: string;
  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.consultation.update({
        where: { id },
        data: {
          data: dataConsulta,
          adicao: adicao || null,
          lentes: lentes || null,
          laboratorio: laboratorio || null,
          valor: valorEmCentavos,
          observacao: observacao || null,
          ordemServico: ordemServico || null,
          odEsferico: odEsferico || null,
          odCilindrico: odCilindrico || null,
          odEixo: odEixo || null,
          odDnp: odDnp || null,
          odAltura: odAltura || null,
          oeEsferico: oeEsferico || null,
          oeCilindrico: oeCilindrico || null,
          oeEixo: oeEixo || null,
          oeDnp: oeDnp || null,
          oeAltura: oeAltura || null,
        },
      });
      clientId = updated.clientId;

      if (paymentData) {
        // Upsert the payment (replace installments if method is crediario)
        const existing = await tx.payment.findUnique({ where: { consultationId: id } });
        if (existing) {
          // Delete old installments and recreate
          await tx.installment.deleteMany({ where: { paymentId: existing.id } });
          await tx.payment.update({
            where: { consultationId: id },
            data: {
              method: paymentData.method,
              status: paymentData.status,
              totalPago: paymentData.totalPago,
              installments: paymentData.installments.length > 0
                ? { create: paymentData.installments }
                : undefined,
            },
          });
        } else {
          await tx.payment.create({
            data: {
              consultationId: id,
              method: paymentData.method,
              status: paymentData.status,
              totalPago: paymentData.totalPago,
              installments: paymentData.installments.length > 0
                ? { create: paymentData.installments }
                : undefined,
            },
          });
        }
      }
    });
  } catch (error) {
    console.error("Prisma updateConsultation error:", error);
    throw new Error("Ocorreu um erro ao atualizar os dados da consulta no banco de dados.");
  }

  revalidatePath(`/clientes/${clientId!}`);
  revalidatePath(`/consultas/${id}`);
  redirect(`/consultas/${id}`);
}

export async function deleteConsultation(id: string) {
  await requireAuthenticated();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Identificador de consulta inválido.");
  }

  // Authorize user has access to this consultation
  const hasAccess = await canAccessConsultation(id);
  if (!hasAccess) {
    throw new Error("Acesso negado. Você não tem permissão para excluir esta consulta.");
  }

  let clientId: string;
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
      select: { clientId: true },
    });
    
    if (!consultation) {
      throw new Error("Consulta não encontrada.");
    }
    
    clientId = consultation.clientId;

    await prisma.consultation.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Prisma deleteConsultation error:", error);
    throw new Error("Ocorreu um erro ao excluir a consulta no banco de dados.");
  }

  revalidatePath(`/clientes/${clientId}`);
  return { success: true, clientId };
}

/**
 * Mark a single installment as paid and recalculate payment status.
 */
export async function markInstallmentPaid(installmentId: string, consultationId: string) {
  await requireAuthenticated();

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(installmentId) || !uuidRegex.test(consultationId)) {
    throw new Error("Identificador inválido.");
  }

  // Authorize access via consultation ownership chain
  const hasAccess = await canAccessConsultation(consultationId);
  if (!hasAccess) {
    throw new Error("Acesso negado.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Mark the installment as paid
      const installment = await tx.installment.update({
        where: { id: installmentId },
        data: { pago: true, paidAt: new Date() },
      });

      // Re-check all installments to determine new status
      const allInstallments = await tx.installment.findMany({
        where: { paymentId: installment.paymentId },
        select: { pago: true },
      });

      const allPaid = allInstallments.every((i) => i.pago);
      const newStatus: PaymentStatus = allPaid ? "PAGO" : "PARCIAL";

      // Only update status. totalPago stores the entrada value (set at creation)
      // and must NOT be overwritten here — the page calculates effective total paid
      // as (payment.totalPago + sum of paid installments) on the fly.
      await tx.payment.update({
        where: { id: installment.paymentId },
        data: { status: newStatus },
      });
    });
  } catch (error) {
    console.error("Prisma markInstallmentPaid error:", error);
    throw new Error("Ocorreu um erro ao atualizar a parcela.");
  }



  revalidatePath(`/consultas/${consultationId}`);
}
