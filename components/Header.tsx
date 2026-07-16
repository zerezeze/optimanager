"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Users, User, Shield } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  email?: string | null;
  role?: string | null;
}

export default function Header({ email, role }: HeaderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    toast.success("Sessão encerrada com sucesso.");
    await signOut({ callbackUrl: "/login" });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:py-4 sm:px-8 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <strong className="text-lg text-gray-800 tracking-tight">OptiManager</strong>
        </div>
        <nav className="flex gap-4">
          <Link
            href="/dashboard"
            className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              isActive("/dashboard") ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/clientes"
            className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              isActive("/clientes") || pathname?.startsWith("/clientes")
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Clientes</span>
          </Link>
          {role === "ADMIN" && (
            <Link
              href="/usuarios"
              className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                isActive("/usuarios") || pathname?.startsWith("/usuarios")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0">
        <div className="flex flex-col text-left sm:text-right">
          {email && (
            <span className="text-sm text-gray-800 font-semibold truncate max-w-[180px] sm:max-w-xs" title={email}>
              {email}
            </span>
          )}
          {role && (
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              {role === "ADMIN" ? "Administrador" : "Operador"}
            </span>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          disabled={loading}
          className="btn btn-secondary flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          style={{ padding: "6px 12px", fontSize: "13px" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          {loading ? "Saindo..." : "Sair"}
        </button>
      </div>
    </header>
  );
}
