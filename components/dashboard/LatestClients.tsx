"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ClientItem {
  id: string;
  nome: string;
  telefone: string | null;
  createdAt: Date;
}

interface LatestClientsProps {
  clients: ClientItem[];
}

export function LatestClients({ clients }: LatestClientsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Últimos Clientes Cadastrados
        </h3>
        <Link href="/clientes">
          <span className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
            Ver Todos &rarr;
          </span>
        </Link>
      </div>
      <Card className="p-5">
        {clients.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-6 text-center">Nenhum cliente cadastrado ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {clients.map((client) => {
              const formattedDate = new Date(client.createdAt).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              });

              return (
                <li key={client.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 min-w-0">
                  <div className="min-w-0 pr-3 flex-1">
                    <strong className="text-sm font-bold text-slate-800 block truncate" title={client.nome}>
                      {client.nome}
                    </strong>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5 font-medium">
                      {client.telefone || "Sem telefone"} • Cadastrado em {formattedDate}
                    </span>
                  </div>
                  <Link href={`/clientes/${client.id}`}>
                    <Button variant="ghost" className="text-xs py-1.5 px-3">
                      <span>Perfil</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
