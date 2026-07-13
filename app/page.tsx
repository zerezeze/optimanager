import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is already authenticated, redirect directly to dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "540px", padding: "40px", backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
          
          {/* Header Section */}
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#333", margin: "0 0 8px 0" }}>OptiManager</h1>
          <p style={{ fontSize: "18px", color: "#0070f3", fontWeight: "600", margin: "0 0 16px 0" }}>
            Sistema de Gestão para Óticas
          </p>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", margin: "0 0 32px 0" }}>
            Centralize e simplifique o controle diário de sua ótica. Gerencie cadastros de clientes, prontuários de exames refrativos, prescrições de lentes e receitas comerciais em um só lugar.
          </p>

          {/* Feature List Section */}
          <div style={{ textAlign: "left", marginBottom: "36px", borderTop: "1px solid #f0f0f0", paddingTop: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "16px" }}>Recursos Principais:</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#555" }}>
                <span style={{ color: "#0070f3", fontWeight: "bold" }}>&bull;</span> Cadastro de Clientes
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#555" }}>
                <span style={{ color: "#0070f3", fontWeight: "bold" }}>&bull;</span> Histórico de Consultas
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#555" }}>
                <span style={{ color: "#0070f3", fontWeight: "bold" }}>&bull;</span> Gestão de Receitas
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#555" }}>
                <span style={{ color: "#0070f3", fontWeight: "bold" }}>&bull;</span> Pesquisa Rápida
              </li>
            </ul>
          </div>

          {/* Action Button Section */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ width: "100%", maxWidth: "200px", padding: "12px", fontSize: "15px" }}
            >
              Entrar no Sistema
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer style={{ padding: "20px", borderTop: "1px solid #e0e0e0", backgroundColor: "#ffffff", textAlign: "center", color: "#888", fontSize: "13px" }}>
        <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>&copy; 2026 OptiManager</p>
        <p style={{ margin: 0 }}>Desenvolvido por José Everton</p>
      </footer>
    </div>
  );
}
