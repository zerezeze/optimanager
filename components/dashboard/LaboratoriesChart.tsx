"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

interface LaboratoriesChartProps {
  data: Array<{ name: string; quantidade: number }>;
}

export function LaboratoriesChart({ data }: LaboratoriesChartProps) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-bold text-slate-700">Laboratórios Mais Utilizados</h4>
        <p className="text-xs text-slate-400 font-medium">Distribuição de consultas pelos laboratórios no período selecionado</p>
      </div>
      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
            Nenhum laboratório registrado no período.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
                labelStyle={{ fontWeight: "bold", color: "#334155" }}
                formatter={(value: any) => [value, "Consultas"]}
              />
              <Bar dataKey="quantidade" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
