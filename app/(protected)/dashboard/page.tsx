import prisma from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  // Query all statistics and lists in parallel via Promise.all
  const [totalClients, totalConsultations, recentClients, recentConsultations] = await Promise.all([
    prisma.client.count(),
    prisma.consultation.count(),
    prisma.client.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.consultation.findMany({
      take: 5,
      orderBy: {
        data: "desc",
      },
      include: {
        client: true,
      },
    }),
  ]);

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333", marginBottom: "24px" }}>Dashboard</h1>

      {/* Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "600" }}>Total de Clientes</span>
          <h2 style={{ fontSize: "36px", margin: "8px 0 0 0", color: "#0070f3", fontWeight: "bold" }}>{totalClients}</h2>
        </div>
        <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "600" }}>Total de Consultas</span>
          <h2 style={{ fontSize: "36px", margin: "8px 0 0 0", color: "#0070f3", fontWeight: "bold" }}>{totalConsultations}</h2>
        </div>
      </div>

      {/* Shortcut Buttons */}
      <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "16px", margin: "0 0 16px 0", color: "#333", fontWeight: "bold" }}>Atalhos Rápidos</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/clientes/novo"
            style={{ padding: "10px 20px", textDecoration: "none", backgroundColor: "#0070f3", color: "white", borderRadius: "4px", fontSize: "14px", fontWeight: "600" }}
          >
            + Novo Cliente
          </Link>
          <Link
            href="/clientes"
            style={{ padding: "10px 20px", textDecoration: "none", backgroundColor: "#333", color: "white", borderRadius: "4px", fontSize: "14px", fontWeight: "600" }}
          >
            Ver Clientes
          </Link>
        </div>
      </div>

      {/* Lists of Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "32px" }}>
        {/* Recent Clients */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>Últimos Clientes Cadastrados</h3>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", padding: "12px 16px" }}>
            {recentClients.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px", margin: "16px 0", textAlign: "center" }}>Nenhum cliente cadastrado ainda.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {recentClients.map((client) => (
                  <li key={client.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div>
                      <strong style={{ fontSize: "14px", color: "#333" }}>{client.nome}</strong>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "2px" }}>{client.telefone || "Sem telefone"}</span>
                    </div>
                    <Link
                      href={`/clientes/${client.id}`}
                      style={{ textDecoration: "none", color: "#0070f3", fontSize: "13px", fontWeight: "600" }}
                    >
                      Ver Perfil
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Consultations */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>Consultas Recentes</h3>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff", padding: "12px 16px" }}>
            {recentConsultations.length === 0 ? (
              <p style={{ color: "#666", fontSize: "14px", margin: "16px 0", textAlign: "center" }}>Nenhuma consulta realizada ainda.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {recentConsultations.map((consultation) => {
                  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  });
                  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });

                  return (
                    <li key={consultation.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#333" }}>{consultation.client.nome}</strong>
                        <span style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "2px" }}>
                          {formattedDate} - {formattedValue}
                        </span>
                      </div>
                      <Link
                        href={`/consultas/${consultation.id}`}
                        style={{ textDecoration: "none", color: "#0070f3", fontSize: "13px", fontWeight: "600" }}
                      >
                        Ver Ficha
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
