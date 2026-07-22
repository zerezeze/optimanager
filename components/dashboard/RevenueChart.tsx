"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";

interface RevenueChartProps {
  data: Array<{ name: string; valor: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-bold text-slate-700">Faturamento Mensal</h4>
        <p className="text-xs text-slate-400 font-medium">Evolução da receita bruta em reais nos últimos 12 meses</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}
              labelStyle={{ fontWeight: "bold", color: "#334155" }}
              formatter={(value: any) => [`R$ ${Number(value).toLocaleString("pt-BR")},00`, "Receita"]}
            />
            <Area type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
