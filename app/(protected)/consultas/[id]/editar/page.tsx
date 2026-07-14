import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditarForm from "./Form";
import { requireAuthenticated } from "@/lib/authz";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarConsultaPage({ params }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!consultation) {
    notFound();
  }

  // Multi-tenant permission check
  if (sessionUser.role !== "ADMIN" && consultation.client.userId !== sessionUser.id) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Editar Consulta</h1>
      <p className="text-sm text-gray-500 mb-6">
        Cliente: <strong className="text-gray-700">{consultation.client.nome}</strong>
      </p>
      <EditarForm consultation={consultation} />
    </div>
  );
}
