import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Consultation } from "@prisma/client";
import DeleteClientButton from "@/components/DeleteClientButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientePerfilPage({ params }: PageProps) {
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      consultations: {
        orderBy: {
          data: "desc",
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Link href="/clientes" style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}>
          &larr; Voltar para Clientes
        </Link>
        <Link
          href={`/clientes/${client.id}/consultas/nova`}
          className="btn btn-primary"
          style={{ padding: "8px 16px", fontSize: "14px" }}
        >
          + Nova Consulta
        </Link>
      </div>

      {/* Client Profile Info Card */}
      <div style={{ padding: "24px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#333" }}>{client.nome}</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href={`/clientes/${client.id}/editar`}
              className="btn btn-secondary"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Editar
            </Link>
            <DeleteClientButton clientId={client.id} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <strong style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Telefone</strong>
            <span style={{ fontSize: "15px", color: "#333" }}>{client.telefone || "Não informado"}</span>
          </div>
          <div>
            <strong style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Endereço</strong>
            <span style={{ fontSize: "15px", color: "#333" }}>{client.endereco || "Não informado"}</span>
          </div>
        </div>
      </div>

      {/* Consultations History list */}
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>Histórico de Consultas</h2>
      
      <div style={{ border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
        {client.consultations.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#666" }}>
            Nenhuma consulta realizada para este cliente.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Data</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Olho D.</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Olho E.</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Lentes</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Valor</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555", textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {client.consultations.map((consultation: Consultation) => {
                const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                  timeZone: "UTC", // Keep UTC time matching database storage safely
                });
                const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
                
                return (
                  <tr key={consultation.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#333", fontWeight: "600" }}>{formattedDate}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#555" }}>{consultation.olhoDireito || "-"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#555" }}>{consultation.olhoEsquerdo || "-"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#555" }}>{consultation.lentes || "-"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#333" }}>{formattedValue}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", textAlign: "right" }}>
                      <Link
                        href={`/consultas/${consultation.id}`}
                        style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
