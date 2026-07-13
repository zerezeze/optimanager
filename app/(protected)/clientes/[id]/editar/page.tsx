import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditarForm from "./Form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: PageProps) {
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

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Cliente</h1>
      <EditarForm client={client} />
    </div>
  );
}
