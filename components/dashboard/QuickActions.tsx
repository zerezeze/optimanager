"use client";

import Link from "next/link";
import { Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function QuickActions() {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-bold text-slate-700">Ações Rápidas</h4>
        <p className="text-xs text-slate-400 font-medium">Acesse atalhos frequentes do sistema operacional</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/clientes/novo" className="w-full">
          <Button className="w-full text-xs py-2.5 px-3.5 shadow-sm font-bold flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
        <Link href="/clientes" className="w-full">
          <Button className="w-full text-xs py-2.5 px-3.5 shadow-sm font-bold flex items-center justify-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>Nova Consulta</span>
          </Button>
        </Link>
        <Link href="/clientes" className="w-full">
          <Button variant="secondary" className="w-full text-xs py-2.5 px-3.5 shadow-sm font-bold flex items-center justify-center gap-1.5">
            <Search className="w-4 h-4" />
            <span>Pesquisar Cliente</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
