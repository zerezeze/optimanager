"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

interface ClientsChartProps {
  data: Array<{ name: string; valor: number }>;
}

export function ClientsChart({ data }: ClientsChartProps) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-bold text-slate-700">Novos Clientes</h4>
        <p className="text-xs text-slate-400 font-medium">Quantidade de novos clientes cadastrados por mês nos últimos 12 meses</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
              labelStyle={{ fontWeight: "bold", color: "#334155" }}
              formatter={(value: any) => [value, "Novos Clientes"]}
            />
            <Bar dataKey="valor" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
