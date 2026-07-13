"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const consultationSchema = z.object({
  data: z.string().optional().or(z.literal("")),
  olhoDireito: z.string().trim().max(50, "Olho direito deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  olhoEsquerdo: z.string().trim().max(50, "Olho esquerdo deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  adicao: z.string().trim().max(50, "Adição deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  lentes: z.string().trim().max(255, "Lentes deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  laboratorio: z.string().trim().max(255, "Laboratório deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  valor: z.string().trim().min(1, "O valor é obrigatório"),
  observacao: z.string().trim().optional().or(z.literal("")),
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
  // Validate UUID format of clientId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(clientId)) {
    throw new Error("Cliente inválido.");
  }

  const rawData = {
    data: formData.get("data"),
    olhoDireito: formData.get("olhoDireito"),
    olhoEsquerdo: formData.get("olhoEsquerdo"),
    adicao: formData.get("adicao"),
    lentes: formData.get("lentes"),
    laboratorio: formData.get("laboratorio"),
    valor: formData.get("valor"),
    observacao: formData.get("observacao"),
  };

  const validation = consultationSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { data, olhoDireito, olhoEsquerdo, adicao, lentes, laboratorio, valor, observacao } = validation.data;

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
        olhoDireito: olhoDireito || null,
        olhoEsquerdo: olhoEsquerdo || null,
        adicao: adicao || null,
        lentes: lentes || null,
        laboratorio: laboratorio || null,
        valor: valorEmCentavos,
        observacao: observacao || null,
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
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Identificador de consulta inválido.");
  }

  const rawData = {
    data: formData.get("data"),
    olhoDireito: formData.get("olhoDireito"),
    olhoEsquerdo: formData.get("olhoEsquerdo"),
    adicao: formData.get("adicao"),
    lentes: formData.get("lentes"),
    laboratorio: formData.get("laboratorio"),
    valor: formData.get("valor"),
    observacao: formData.get("observacao"),
  };

  const validation = consultationSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { data, olhoDireito, olhoEsquerdo, adicao, lentes, laboratorio, valor, observacao } = validation.data;

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
        olhoDireito: olhoDireito || null,
        olhoEsquerdo: olhoEsquerdo || null,
        adicao: adicao || null,
        lentes: lentes || null,
        laboratorio: laboratorio || null,
        valor: valorEmCentavos,
        observacao: observacao || null,
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
