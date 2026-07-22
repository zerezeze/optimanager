import prisma from "@/lib/db";
import { PaymentMethod, PaymentStatus, UserRole } from "@prisma/client";

export interface DashboardFilters {
  range: string; // "hoje" | "7d" | "30d" | "90d" | "este_ano"
}

export function getRangeStartDate(range: string): Date {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(today);

  switch (range) {
    case "hoje":
      break;
    case "7d":
      startDate.setDate(today.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(today.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(today.getDate() - 90);
      break;
    case "este_ano":
      return new Date(now.getFullYear(), 0, 1);
    default:
      startDate.setDate(today.getDate() - 30); // default to 30d
      break;
  }

  return startDate;
}

export interface DashboardMetrics {
  // Principais
  totalClients: number;
  totalConsultations: number;
  receitaTotal: number;
  ticketMedio: number;

  // Operacionais
  consultasHoje: number;
  consultasSemana: number;
  consultasMes: number;
  clientesMes: number;

  // Resumo Financeiro
  receitaHoje: number;
  receitaMes: number;
  receitaAno: number;

  // Dados das tabelas
  latestClients: Array<{ id: string; nome: string; telefone: string | null; createdAt: Date }>;
  latestConsultations: Array<{
    id: string;
    client: { nome: string };
    medico: string | null;
    data: Date;
    valor: number;
  }>;

  // Gráficos (últimos 12 meses)
  revenueChartData: Array<{ name: string; valor: number }>;
  clientsChartData: Array<{ name: string; valor: number }>;
  consultationsChartData: Array<{ name: string; valor: number }>;
  laboratoriesChartData: Array<{ name: string; quantidade: number }>;
}

export async function fetchDashboardData(
  sessionUser: { id: string; role: UserRole },
  filters: DashboardFilters
): Promise<DashboardMetrics> {
  const isAdmin = sessionUser.role === "ADMIN";
  
  // Base where filters for multi-tenant
  const whereClientBase = isAdmin ? {} : { userId: sessionUser.id };
  const whereConsultationBase = isAdmin ? {} : { client: { userId: sessionUser.id } };

  const startDate = getRangeStartDate(filters.range);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Fixed ranges for operational metrics
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Start of week (Monday)
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Range-scoped conditions
  const whereClientRange = {
    ...whereClientBase,
    createdAt: { gte: startDate },
  };

  const whereConsultationRange = {
    ...whereConsultationBase,
    data: { gte: startDate },
  };

  // Promise.all to fetch metrics efficiently
  const [
    totalClientsRange,
    totalConsultationsRange,
    receitaTotalRangeAggregate,
    consultasHoje,
    consultasSemana,
    consultasMes,
    clientesMes,
    receitaHojeAggregate,
    receitaMesAggregate,
    receitaAnoAggregate,
    latestClients,
    latestConsultations,
    allRevenueConsultations,
    allClients,
    allConsultations,
    groupedLabs,
  ] = await Promise.all([
    // Total Clients in Range
    prisma.client.count({ where: whereClientRange }),

    // Total Consultations in Range
    prisma.consultation.count({ where: whereConsultationRange }),

    // Total Revenue in Range
    prisma.consultation.aggregate({
      where: whereConsultationRange,
      _sum: { valor: true },
    }),

    // Consultas Hoje
    prisma.consultation.count({
      where: {
        ...whereConsultationBase,
        data: { gte: today },
      },
    }),

    // Consultas Semana
    prisma.consultation.count({
      where: {
        ...whereConsultationBase,
        data: { gte: startOfWeek },
      },
    }),

    // Consultas Mes
    prisma.consultation.count({
      where: {
        ...whereConsultationBase,
        data: { gte: startOfMonth },
      },
    }),

    // Clientes cadastrados Mes
    prisma.client.count({
      where: {
        ...whereClientBase,
        createdAt: { gte: startOfMonth },
      },
    }),

    // Receita Hoje
    prisma.consultation.aggregate({
      where: {
        ...whereConsultationBase,
        data: { gte: today },
      },
      _sum: { valor: true },
    }),

    // Receita Mês
    prisma.consultation.aggregate({
      where: {
        ...whereConsultationBase,
        data: { gte: startOfMonth },
      },
      _sum: { valor: true },
    }),

    // Receita Ano
    prisma.consultation.aggregate({
      where: {
        ...whereConsultationBase,
        data: { gte: startOfYear },
      },
      _sum: { valor: true },
    }),

    // Latest Clients (max 5)
    prisma.client.findMany({
      where: whereClientBase,
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        telefone: true,
        createdAt: true,
      },
    }),

    // Latest Consultations (max 5)
    prisma.consultation.findMany({
      where: whereConsultationBase,
      take: 5,
      orderBy: { data: "desc" },
      select: {
        id: true,
        data: true,
        valor: true,
        medico: true,
        client: {
          select: { nome: true },
        },
      },
    }),

    // Fetch data for the last 12 months for charts
    prisma.consultation.findMany({
      where: {
        ...whereConsultationBase,
        data: { gte: new Date(now.getFullYear() - 1, now.getMonth() + 1, 1) },
      },
      select: { data: true, valor: true },
    }),

    prisma.client.findMany({
      where: {
        ...whereClientBase,
        createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth() + 1, 1) },
      },
      select: { createdAt: true },
    }),

    prisma.consultation.findMany({
      where: {
        ...whereConsultationBase,
        data: { gte: new Date(now.getFullYear() - 1, now.getMonth() + 1, 1) },
      },
      select: { data: true },
    }),

    // Top laboratories in selected range
    prisma.consultation.groupBy({
      by: ["laboratorio"],
      where: {
        ...whereConsultationRange,
        laboratorio: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const receitaTotal = receitaTotalRangeAggregate._sum.valor ?? 0;
  const ticketMedio = totalConsultationsRange > 0 ? Math.round(receitaTotal / totalConsultationsRange) : 0;

  // Process 12 months data in memory
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
  const monthsLabels: { key: string; label: string }[] = [];
  const temp = new Date(twelveMonthsAgo);
  for (let i = 0; i < 12; i++) {
    const key = `${temp.getFullYear()}-${String(temp.getMonth() + 1).padStart(2, "0")}`;
    const label = temp.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    monthsLabels.push({ key, label });
    temp.setMonth(temp.getMonth() + 1);
  }

  // Helper function to map database objects into 12-month metrics
  const groupDataByMonth = (
    data: any[],
    dateField: string,
    valueField?: string
  ): Array<{ name: string; valor: number }> => {
    const map = new Map<string, number>();
    monthsLabels.forEach((m) => map.set(m.key, 0));

    data.forEach((item) => {
      const d = new Date(item[dateField]);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (map.has(key)) {
        const current = map.get(key) || 0;
        const add = valueField ? item[valueField] : 1;
        map.set(key, current + add);
      }
    });

    return monthsLabels.map((m) => {
      const val = map.get(m.key) || 0;
      return {
        name: m.label,
        valor: valueField ? Math.round(val / 100) : val, // Convert BRL to whole integers for better graphing
      };
    });
  };

  const revenueChartData = groupDataByMonth(allRevenueConsultations, "data", "valor");
  const clientsChartData = groupDataByMonth(allClients, "createdAt");
  const consultationsChartData = groupDataByMonth(allConsultations, "data");

  const laboratoriesChartData = groupedLabs.map((lab) => ({
    name: lab.laboratorio || "Não informado",
    quantidade: lab._count.id,
  }));

  return {
    totalClients: totalClientsRange,
    totalConsultations: totalConsultationsRange,
    receitaTotal,
    ticketMedio,

    consultasHoje,
    consultasSemana,
    consultasMes,
    clientesMes,

    receitaHoje: receitaHojeAggregate._sum.valor ?? 0,
    receitaMes: receitaMesAggregate._sum.valor ?? 0,
    receitaAno: receitaAnoAggregate._sum.valor ?? 0,

    latestClients,
    latestConsultations,

    revenueChartData,
    clientsChartData,
    consultationsChartData,
    laboratoriesChartData,
  };
}
