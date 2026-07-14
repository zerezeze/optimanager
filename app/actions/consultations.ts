"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuthenticated, canAccessClient, canAccessConsultation } from "@/lib/authz";

const esfericoCilindricoRegex = /^(PLANO|[+-]?\d+([.,]\d+)?)$/i;
const numericWithDecimalsRegex = /^\d+([.,]\d{1,2})?$/;

const consultationSchema = z.object({
  data: z.string().optional().or(z.literal("")),
  adicao: z.string().trim().max(50, "Adição deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  lentes: z.string().trim().max(255, "Lentes deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  laboratorio: z.string().trim().max(255, "Laboratório deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  valor: z.string().trim().min(1, "O valor é obrigatório"),
  observacao: z.string().trim().optional().or(z.literal("")),

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

  try {
    await prisma.consultation.create({
      data: {
        clientId,
        data: dataConsulta,
        adicao: adicao || null,
        lentes: lentes || null,
        laboratorio: laboratorio || null,
        valor: valorEmCentavos,
        observacao: observacao || null,
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

  let clientId: string;
  try {
    const updated = await prisma.consultation.update({
      where: { id },
      data: {
        data: dataConsulta,
        adicao: adicao || null,
        lentes: lentes || null,
        laboratorio: laboratorio || null,
        valor: valorEmCentavos,
        observacao: observacao || null,
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
  } catch (error) {
    console.error("Prisma updateConsultation error:", error);
    throw new Error("Ocorreu um erro ao atualizar os dados da consulta no banco de dados.");
  }

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath(`/consultas/${id}`);
  redirect(`/consultas/${id}`);
}
