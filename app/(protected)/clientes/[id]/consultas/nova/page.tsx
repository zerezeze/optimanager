import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import NovaForm from "./Form";
import { requireAuthenticated } from "@/lib/authz";

import { PageHeader } from "@/components/ui/PageHeader";

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
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full flex flex-col gap-6">
      <PageHeader
        title="Nova Consulta"
        description={`Registrar consulta para o cliente: ${client.nome}`}
        backHref={`/clientes/${client.id}`}
        backLabel="Voltar ao Perfil"
      />
      <NovaForm clientId={client.id} />
    </div>
  );
}
