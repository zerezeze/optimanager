import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultaDetalhesPage({ params }: PageProps) {
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

  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Link
          href={`/clientes/${consultation.clientId}`}
          style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}
        >
          &larr; Voltar para Perfil de {consultation.client.nome}
        </Link>
        <Link
          href={`/consultas/${consultation.id}/editar`}
          style={{ padding: "8px 16px", textDecoration: "none", backgroundColor: "#333", color: "white", borderRadius: "4px", fontSize: "14px", fontWeight: "600" }}
        >
          Editar Consulta
        </Link>
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", padding: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 4px 0", color: "#333" }}>Ficha da Consulta</h1>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#666" }}>
          Cliente: <strong>{consultation.client.nome}</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Data e Valor */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Data da Consulta</strong>
              <span style={{ fontSize: "15px", color: "#333", fontWeight: "600" }}>{formattedDate}</span>
            </div>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Valor</strong>
              <span style={{ fontSize: "15px", color: "#333", fontWeight: "600" }}>{formattedValue}</span>
            </div>
          </div>

          {/* Olho Direito e Olho Esquerdo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Olho Direito</strong>
              <span style={{ fontSize: "14px", color: "#333" }}>{consultation.olhoDireito || "Não informado"}</span>
            </div>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Olho Esquerdo</strong>
              <span style={{ fontSize: "14px", color: "#333" }}>{consultation.olhoEsquerdo || "Não informado"}</span>
            </div>
          </div>

          {/* Adição e Lentes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Adição</strong>
              <span style={{ fontSize: "14px", color: "#333" }}>{consultation.adicao || "Não informado"}</span>
            </div>
            <div>
              <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Lentes</strong>
              <span style={{ fontSize: "14px", color: "#333" }}>{consultation.lentes || "Não informado"}</span>
            </div>
          </div>

          {/* Laboratório */}
          <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
            <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Laboratório</strong>
            <span style={{ fontSize: "14px", color: "#333" }}>{consultation.laboratorio || "Não informado"}</span>
          </div>

          {/* Observação */}
          <div>
            <strong style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>Observação</strong>
            <span style={{ fontSize: "14px", color: "#333", whiteSpace: "pre-wrap", display: "block", lineHeight: "1.5" }}>
              {consultation.observacao || "Nenhuma observação informada."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
