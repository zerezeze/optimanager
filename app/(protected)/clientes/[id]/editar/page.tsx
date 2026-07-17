import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditarForm from "./Form";
import { requireAuthenticated } from "@/lib/authz";

import { PageHeader } from "@/components/ui/PageHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const { id } = await params;

  // Validate UUID format to prevent database crash on invalid UUID syntax
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
        title="Editar Cliente"
        description="Atualize as informações cadastrais do cliente nos campos abaixo."
        backHref={`/clientes/${id}`}
        backLabel="Voltar ao Perfil"
      />
      <EditarForm client={client} />
    </div>
  );
}
