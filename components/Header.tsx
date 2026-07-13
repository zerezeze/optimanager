import { signOut } from "@/auth";
import Link from "next/link";

interface HeaderProps {
  email?: string | null;
}

export default function Header({ email }: HeaderProps) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #e0e0e0", backgroundColor: "#fff", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <strong style={{ fontSize: "18px", color: "#333" }}>OptiManager</strong>
        <nav style={{ display: "flex", gap: "16px" }}>
          <Link href="/dashboard" style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}>
            Dashboard
          </Link>
          <Link href="/clientes" style={{ textDecoration: "none", color: "#0070f3", fontSize: "14px", fontWeight: "600" }}>
            Clientes
          </Link>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {email && <span style={{ fontSize: "14px", color: "#555" }}>{email}</span>}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            style={{ padding: "6px 12px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
