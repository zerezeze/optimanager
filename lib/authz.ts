import { auth } from "@/auth";
import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
  name: string;
}

/**
 * Returns the current authenticated user session details, or null if not logged in.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email || "",
    role: session.user.role as "ADMIN" | "OPERATOR",
    name: session.user.name || "",
  };
}

/**
 * Ensures the user is logged in, throwing an error otherwise.
 */
export async function requireAuthenticated(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Ensures the logged-in user is an administrator, throwing an error otherwise.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuthenticated();
  if (user.role !== "ADMIN") {
    throw new Error("Acesso negado. Esta operação exige perfil de administrador.");
  }
  return user;
}

/**
 * Validates if the current user has permission to access the given client.
 * Returns true if allowed, false otherwise.
 */
export async function canAccessClient(clientId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  // Validate client ownership
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { userId: true },
  });

  if (!client) return false;
  return client.userId === user.id;
}

/**
 * Validates if the current user has permission to access the given client.
 * Throws a Next.js notFound() page if not allowed.
 */
export async function assertCanAccessClient(clientId: string): Promise<void> {
  const allowed = await canAccessClient(clientId);
  if (!allowed) {
    notFound();
  }
}

/**
 * Validates if the current user has permission to access the given consultation.
 * Returns true if allowed, false otherwise.
 */
export async function canAccessConsultation(consultationId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  // Fetch consultation and its client to inspect ownership
  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
    select: {
      client: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!consultation?.client) return false;
  return consultation.client.userId === user.id;
}

/**
 * Validates if the current user has permission to access the given consultation.
 * Throws a Next.js notFound() page if not allowed.
 */
export async function assertCanAccessConsultation(consultationId: string): Promise<void> {
  const allowed = await canAccessConsultation(consultationId);
  if (!allowed) {
    notFound();
  }
}
