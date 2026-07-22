import { requireAuthenticated } from "@/lib/authz";
import { fetchDashboardData } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ClientsChart } from "@/components/dashboard/ClientsChart";
import { ConsultationsChart } from "@/components/dashboard/ConsultationsChart";
import { LaboratoriesChart } from "@/components/dashboard/LaboratoriesChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LatestClients } from "@/components/dashboard/LatestClients";
import { LatestConsultations } from "@/components/dashboard/LatestConsultations";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { Card } from "@/components/ui/Card";
import { Users, Eye, DollarSign, BarChart3, Calendar, CheckSquare, Sparkles } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sessionUser = await requireAuthenticated();
  const { range = "30d" } = await searchParams;

  // Fetch all aggregated metrics directly on the server
  const metrics = await fetchDashboardData(sessionUser, { range });

  const formattedReceita = (metrics.receitaTotal / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formattedTicket = (metrics.ticketMedio / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto font-sans w-full flex flex-col gap-6">
      
      {/* Top Header & Filter */}
      <PageHeader
        title="Painel Executivo"
        description="Acompanhe os principais indicadores de crescimento, consultas e faturamento da ótica."
      >
        <DateRangeFilter />
      </PageHeader>

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total de Clientes"
          value={metrics.totalClients}
          icon={<Users className="w-4 h-4 text-slate-500" />}
          description="novos cadastros no período"
        />
        <MetricCard
          title="Total de Consultas"
          value={metrics.totalConsultations}
          icon={<Eye className="w-4 h-4 text-slate-500" />}
          description="exames realizados no período"
        />
        <MetricCard
          title="Receita Total"
          value={formattedReceita}
          icon={<DollarSign className="w-4 h-4 text-slate-500" />}
          description="valor bruto no período"
          variant={metrics.receitaTotal > 0 ? "success" : "default"}
        />
        <MetricCard
          title="Ticket Médio"
          value={formattedTicket}
          icon={<BarChart3 className="w-4 h-4 text-slate-500" />}
          description="média por consulta no período"
        />
      </div>

      {/* Row 2: Secondary/Operational Indicators */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
          Indicadores Operacionais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultas Hoje</span>
              <strong className="text-xl font-bold text-slate-800 mt-1 block">{metrics.consultasHoje}</strong>
            </div>
            <Calendar className="w-5 h-5 text-blue-500 bg-blue-50/50 p-1 rounded" />
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultas esta Semana</span>
              <strong className="text-xl font-bold text-slate-800 mt-1 block">{metrics.consultasSemana}</strong>
            </div>
            <Calendar className="w-5 h-5 text-indigo-500 bg-indigo-50/50 p-1 rounded" />
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultas este Mês</span>
              <strong className="text-xl font-bold text-slate-800 mt-1 block">{metrics.consultasMes}</strong>
            </div>
            <CheckSquare className="w-5 h-5 text-emerald-500 bg-emerald-50/50 p-1 rounded" />
          </div>
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clientes no Mês</span>
              <strong className="text-xl font-bold text-slate-800 mt-1 block">{metrics.clientesMes}</strong>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 bg-amber-50/50 p-1 rounded" />
          </div>
        </div>
      </div>

      {/* Row 3: Financial Summary & Quick Actions side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Resumo Financeiro */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-700">Resumo Financeiro</h4>
            <p className="text-xs text-slate-400 font-medium">Valores brutos faturados por período</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hoje</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">
                {(metrics.receitaHoje / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Este Mês</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">
                {(metrics.receitaMes / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Este Ano</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">
                {(metrics.receitaAno / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Row 4: Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={metrics.revenueChartData} />
        <ClientsChart data={metrics.clientsChartData} />
        <ConsultationsChart data={metrics.consultationsChartData} />
        <LaboratoriesChart data={metrics.laboratoriesChartData} />
      </div>

      {/* Row 5: Latest Entries lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        <LatestClients clients={metrics.latestClients} />
        <LatestConsultations consultations={metrics.latestConsultations} />
      </div>

    </div>
  );
}
