"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/authz";

const userSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório").max(255, "O nome deve ter no máximo 255 caracteres"),
  email: z.string().trim().email("Formato de e-mail inválido").max(255, "E-mail muito longo"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "OPERATOR"], { message: "Perfil selecionado é inválido" }),
});

export async function createUser(formData: FormData) {
  // Ensure only authenticated administrators can create new users
  await requireAdmin();

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const validation = userSchema.safeParse(rawData);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat().join(", "));
  }

  const { name, email, password, role } = validation.data;

  // Verify unique email constraint manually to return a friendly error message
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está cadastrado no sistema.");
  }

  // Encrypt password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
  } catch (error) {
    console.error("Prisma createUser error:", error);
    throw new Error("Ocorreu um erro ao salvar o usuário no banco de dados.");
  }

  revalidatePath("/usuarios");
  redirect("/usuarios");
}
