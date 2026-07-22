"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ConsultationItem {
  id: string;
  data: Date;
  valor: number;
  medico: string | null;
  client: {
    nome: string;
  };
}

interface LatestConsultationsProps {
  consultations: ConsultationItem[];
}

export function LatestConsultations({ consultations }: LatestConsultationsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Consultas Recentes
        </h3>
        <Link href="/clientes">
          <span className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
            Ver Todas &rarr;
          </span>
        </Link>
      </div>
      <Card className="p-5">
        {consultations.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-6 text-center">Nenhuma consulta realizada ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {consultations.map((consultation) => {
              const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              });
              const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
              const medicoLabel = consultation.medico?.trim() || "Não informado";

              return (
                <li key={consultation.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 min-w-0">
                  <div className="min-w-0 pr-3 flex-1">
                    <strong className="text-sm font-bold text-slate-800 block truncate" title={consultation.client.nome}>
                      {consultation.client.nome}
                    </strong>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5 font-medium">
                      Médico: {medicoLabel} • {formattedDate} • {formattedValue}
                    </span>
                  </div>
                  <Link href={`/consultas/${consultation.id}`}>
                    <Button variant="ghost" className="text-xs py-1.5 px-3">
                      <span>Ficha</span>
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
