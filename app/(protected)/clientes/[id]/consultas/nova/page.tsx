import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import NovaForm from "./Form";
import { requireAuthenticated } from "@/lib/authz";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NovaConsultaPage({ params }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    notFound();
  }

  // Multi-tenant permission check
  if (sessionUser.role !== "ADMIN" && client.userId !== sessionUser.id) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nova Consulta</h1>
      <p className="text-sm text-gray-500 mb-6">
        Cliente: <strong className="text-gray-700">{client.nome}</strong>
      </p>
      <NovaForm clientId={client.id} />
    </div>
  );
}
