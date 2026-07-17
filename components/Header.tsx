"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Users, User, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

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

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === path || pathname?.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 fill-current" />
          </span>
          <strong className="text-base font-bold text-slate-900 tracking-tight">OptiManager</strong>
        </div>

        <nav className="flex gap-1">
          <Link
            href="/dashboard"
            className={`text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 ${
              isActive("/dashboard")
                ? "text-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/clientes"
            className={`text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 ${
              isActive("/clientes")
                ? "text-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clientes</span>
          </Link>
          {role === "ADMIN" && (
            <Link
              href="/usuarios"
              className={`text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 ${
                isActive("/usuarios")
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Usuários</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
        <div className="flex flex-col text-left sm:text-right">
          {email && (
            <span className="text-xs text-slate-700 font-bold truncate max-w-[180px] sm:max-w-xs" title={email}>
              {email}
            </span>
          )}
          {role && (
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {role === "ADMIN" ? "Administrador" : "Operador"}
            </span>
          )}
        </div>
        
        <Button
          variant="secondary"
          onClick={handleLogout}
          isLoading={loading}
          className="py-1.5 px-3.5 text-xs rounded-lg shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </Button>
      </div>
    </header>
  );
}
