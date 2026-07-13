"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const clientSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório").max(255, "O nome deve ter no máximo 255 caracteres"),
  endereco: z.string().trim().max(500, "O endereço deve ter no máximo 500 caracteres").optional().or(z.literal("")),
  telefone: z.string().trim().max(20, "O telefone deve ter no máximo 20 caracteres").optional().or(z.literal("")),
});

const consultationSchema = z.object({
  data: z.string().optional().or(z.literal("")),
  olhoDireito: z.string().trim().max(50, "Olho direito deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  olhoEsquerdo: z.string().trim().max(50, "Olho esquerdo deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  adicao: z.string().trim().max(50, "Adição deve ter no máximo 50 caracteres").optional().or(z.literal("")),
  lentes: z.string().trim().max(255, "Lentes deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  laboratorio: z.string().trim().max(255, "Laboratório deve ter no máximo 255 caracteres").optional().or(z.literal("")),
  valor: z.string().trim().min(1, "O valor é obrigatório para cadastrar a consulta").optional().or(z.literal("")),
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

export async function createClient(formData: FormData) {
  const clientRawData = {
    nome: formData.get("nome"),
    endereco: formData.get("endereco"),
    telefone: formData.get("telefone"),
  };

  const clientValidation = clientSchema.safeParse(clientRawData);

  if (!clientValidation.success) {
    const errors = clientValidation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { nome, endereco, telefone } = clientValidation.data;

  // Check if first consultation is filled
  const cadastrarConsulta = formData.get("cadastrarConsulta") === "true";
  let consultationDataObj: any = null;

  if (cadastrarConsulta) {
    const consultationRawData = {
      data: formData.get("data"),
      olhoDireito: formData.get("olhoDireito"),
      olhoEsquerdo: formData.get("olhoEsquerdo"),
      adicao: formData.get("adicao"),
      lentes: formData.get("lentes"),
      laboratorio: formData.get("laboratorio"),
      valor: formData.get("valor"),
      observacao: formData.get("observacao"),
    };

    const consultationValidation = consultationSchema.safeParse(consultationRawData);
    if (!consultationValidation.success) {
      const errors = consultationValidation.error.flatten().fieldErrors;
      throw new Error("Erro na consulta: " + Object.values(errors).flat().join(", "));
    }

    const { data, olhoDireito, olhoEsquerdo, adicao, lentes, laboratorio, valor, observacao } = consultationValidation.data;

    if (!valor) {
      throw new Error("O valor é obrigatório para cadastrar a primeira consulta.");
    }

    let valorEmCentavos: number;
    try {
      valorEmCentavos = parseBRLValueToCents(valor);
    } catch (err: any) {
      throw new Error("Erro na primeira consulta: " + err.message);
    }

    let dataConsulta = new Date();
    if (data) {
      const parsedDate = new Date(data);
      if (!isNaN(parsedDate.getTime())) {
        dataConsulta = parsedDate;
      }
    }

    consultationDataObj = {
      data: dataConsulta,
      olhoDireito: olhoDireito || null,
      olhoEsquerdo: olhoEsquerdo || null,
      adicao: adicao || null,
      lentes: lentes || null,
      laboratorio: laboratorio || null,
      valor: valorEmCentavos,
      observacao: observacao || null,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create client
      const newClient = await tx.client.create({
        data: {
          nome,
          endereco: endereco || null,
          telefone: telefone || null,
        },
      });

      // 2. Create first consultation if present
      if (consultationDataObj) {
        await tx.consultation.create({
          data: {
            clientId: newClient.id,
            ...consultationDataObj,
          },
        });
      }
    });
  } catch (error) {
    console.error("Prisma transaction error in createClient:", error);
    throw new Error("Ocorreu um erro ao salvar o cliente e a primeira consulta no banco de dados.");
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function deleteClient(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Identificador do cliente inválido.");
  }

  // Check database if consultations exist
  const consultationsCount = await prisma.consultation.count({
    where: { clientId: id },
  });

  if (consultationsCount > 0) {
    throw new Error(
      "Não é possível excluir este cliente pois ele possui consultas vinculadas no histórico. Remova ou desvincule as consultas antes de excluí-lo."
    );
  }

  try {
    await prisma.client.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Prisma deleteClient error:", error);
    throw new Error("Ocorreu um erro ao excluir o cliente no banco de dados.");
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateClient(id: string, formData: FormData) {
  const rawData = {
    nome: formData.get("nome"),
    endereco: formData.get("endereco"),
    telefone: formData.get("telefone"),
  };

  const validation = clientSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { nome, endereco, telefone } = validation.data;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("Identificador do cliente inválido.");
  }

  try {
    await prisma.client.update({
      where: { id },
      data: {
        nome,
        endereco: endereco || null,
        telefone: telefone || null,
      },
    });
  } catch (error) {
    console.error("Prisma updateClient error:", error);
    throw new Error("Ocorreu um erro ao atualizar os dados do cliente no banco de dados.");
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}
