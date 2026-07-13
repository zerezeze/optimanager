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

export async function createClient(formData: FormData) {
  const rawData = {
    nome: formData.get("nome"),
    endereco: formData.get("endereco"),
    telefone: formData.get("telefone"),
  };

  const validation = clientSchema.safeParse(rawData);

  if (!validation.success) {
    // Collect error messages
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { nome, endereco, telefone } = validation.data;

  try {
    await prisma.client.create({
      data: {
        nome,
        endereco: endereco || null,
        telefone: telefone || null,
      },
    });
  } catch (error) {
    console.error("Prisma createClient error:", error);
    throw new Error("Ocorreu um erro ao salvar o cliente no banco de dados.");
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
