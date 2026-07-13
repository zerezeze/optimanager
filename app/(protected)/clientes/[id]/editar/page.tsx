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
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>Editar Cliente</h1>
      <EditarForm client={client} />
    </div>
  );
}
