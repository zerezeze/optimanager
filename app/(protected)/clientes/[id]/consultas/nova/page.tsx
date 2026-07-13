import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import NovaForm from "./Form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NovaConsultaPage({ params }: PageProps) {
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

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 4px 0", color: "#333" }}>Nova Consulta</h1>
      <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#666" }}>
        Cliente: <strong>{client.nome}</strong>
      </p>
      <NovaForm clientId={client.id} />
    </div>
  );
}
