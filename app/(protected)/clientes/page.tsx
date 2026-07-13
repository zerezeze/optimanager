import prisma from "@/lib/db";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Query database directly
  const clients = await prisma.client.findMany({
    where: query
      ? {
          nome: {
            contains: query,
            mode: "insensitive", // PostgreSQL case-insensitive search
          },
        }
      : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", margin: 0, fontWeight: "bold", color: "#333" }}>Gestão de Clientes</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/dashboard"
            style={{ padding: "8px 16px", textDecoration: "none", color: "#666", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
          >
            Dashboard
          </Link>
          <Link
            href="/clientes/novo"
            style={{ padding: "8px 16px", textDecoration: "none", backgroundColor: "#0070f3", color: "white", borderRadius: "4px", fontSize: "14px", fontWeight: "600" }}
          >
            + Novo Cliente
          </Link>
        </div>
      </div>

      {/* Simple Search Form */}
      <form method="GET" action="/clientes" style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <input
          type="text"
          name="q"
          placeholder="Buscar cliente por nome..."
          defaultValue={query}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}
        >
          Buscar
        </button>
        {query && (
          <Link
            href="/clientes"
            style={{ padding: "10px 14px", textDecoration: "none", color: "#666", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
          >
            Limpar
          </Link>
        )}
      </form>

      {/* Clients List */}
      <div style={{ border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
        {clients.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#666" }}>
            Nenhum cliente encontrado.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Nome</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Telefone</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555" }}>Endereço</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", color: "#555", textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#333" }}>{client.nome}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#555" }}>{client.telefone || "-"}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#555" }}>{client.endereco || "-"}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", textAlign: "right" }}>
                    <Link
                      href={`/clientes/${client.id}/editar`}
                      style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
