import prisma from "@/lib/db";
import Link from "next/link";
import { requireAuthenticated } from "@/lib/authz";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Eye, DollarSign, Plus, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const sessionUser = await requireAuthenticated();
  
  const isAdmin = sessionUser.role === "ADMIN";
  const whereClient = isAdmin ? {} : { userId: sessionUser.id };
  const whereConsultation = isAdmin ? {} : { client: { userId: sessionUser.id } };

  const whereInstallment = isAdmin
    ? { pago: false }
    : { pago: false, payment: { consultation: { client: { userId: sessionUser.id } } } };

  // Query all statistics and lists in parallel via Promise.all
  const [totalClients, totalConsultations, recentClients, recentConsultations, installmentsAbertos] = await Promise.all([
    prisma.client.count({ where: whereClient }),
    prisma.consultation.count({ where: whereConsultation }),
    prisma.client.findMany({
      where: whereClient,
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.consultation.findMany({
      where: whereConsultation,
      take: 5,
      orderBy: {
        data: "desc",
      },
      include: {
        client: true,
      },
    }),
    prisma.installment.aggregate({
      where: whereInstallment,
      _sum: { valor: true },
    }),
  ]);

  const totalEmAberto = installmentsAbertos._sum.valor ?? 0;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Acompanhe os principais indicadores operacionais e financeiros da sua ótica."
      >
        <Link href="/clientes/novo" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
        <Link href="/clientes" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
            <span>Ver Clientes</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total de Clientes"
          value={totalClients}
          icon={<Users className="w-4 h-4" />}
          description="clientes cadastrados"
        />
        <StatCard
          title="Total de Consultas"
          value={totalConsultations}
          icon={<Eye className="w-4 h-4" />}
          description="consultas registradas"
        />
        <StatCard
          title="Valores em Aberto"
          value={(totalEmAberto / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          icon={<DollarSign className="w-4 h-4" />}
          description="parcelas não pagas"
          variant={totalEmAberto > 0 ? "danger" : "default"}
        />
      </div>

      {/* Lists of Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Recent Clients */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Últimos Clientes Cadastrados
          </h3>
          <Card className="p-5">
            {recentClients.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-6 text-center">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentClients.map((client) => (
                  <li key={client.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 min-w-0">
                    <div className="min-w-0 pr-3 flex-1">
                      <strong className="text-sm font-bold text-slate-800 block truncate" title={client.nome}>
                        {client.nome}
                      </strong>
                      <span className="text-xs text-slate-400 block truncate mt-0.5 font-medium">
                        {client.telefone || "Sem telefone"}
                      </span>
                    </div>
                    <Link href={`/clientes/${client.id}`}>
                      <Button variant="ghost" className="text-xs py-1.5 px-3">
                        <span>Ver Perfil</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Recent Consultations */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Consultas Recentes
          </h3>
          <Card className="p-5">
            {recentConsultations.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-6 text-center">Nenhuma consulta realizada ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentConsultations.map((consultation) => {
                  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  });
                  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });

                  return (
                    <li key={consultation.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 min-w-0">
                      <div className="min-w-0 pr-3 flex-1">
                        <strong className="text-sm font-bold text-slate-800 block truncate" title={consultation.client.nome}>
                          {consultation.client.nome}
                        </strong>
                        <span className="text-xs text-slate-400 block truncate mt-0.5 font-medium">
                          {formattedDate} - {formattedValue}
                        </span>
                      </div>
                      <Link href={`/consultas/${consultation.id}`}>
                        <Button variant="ghost" className="text-xs py-1.5 px-3">
                          <span>Ver Ficha</span>
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
      </div>
    </div>
  );
}
