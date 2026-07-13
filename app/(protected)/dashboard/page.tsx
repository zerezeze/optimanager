import prisma from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  // Query all statistics and lists in parallel via Promise.all
  const [totalClients, totalConsultations, recentClients, recentConsultations] = await Promise.all([
    prisma.client.count(),
    prisma.consultation.count(),
    prisma.client.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.consultation.findMany({
      take: 5,
      orderBy: {
        data: "desc",
      },
      include: {
        client: true,
      },
    }),
  ]);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-850 mb-6">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
          <span className="text-sm font-semibold text-gray-500">Total de Clientes</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">{totalClients}</h2>
        </div>
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
          <span className="text-sm font-semibold text-gray-500">Total de Consultas</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">{totalConsultations}</h2>
        </div>
      </div>

      {/* Shortcut Buttons */}
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm mb-8">
        <h3 className="text-base font-bold text-gray-800 mb-4">Atalhos Rápidos</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/clientes/novo"
            className="btn btn-primary w-full sm:w-auto"
          >
            + Novo Cliente
          </Link>
          <Link
            href="/clientes"
            className="btn btn-secondary w-full sm:w-auto"
          >
            Ver Clientes
          </Link>
        </div>
      </div>

      {/* Lists of Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clients */}
        <div className="min-w-0 w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Últimos Clientes Cadastrados</h3>
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-5 shadow-sm min-w-0 w-full">
            {recentClients.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentClients.map((client) => (
                  <li key={client.id} className="flex justify-between items-center py-3 min-w-0">
                    <div className="min-w-0 pr-3 flex-1">
                      <strong className="text-sm text-gray-800 block truncate" title={client.nome}>
                        {client.nome}
                      </strong>
                      <span className="text-xs text-gray-500 block truncate mt-0.5">
                        {client.telefone || "Sem telefone"}
                      </span>
                    </div>
                    <Link
                      href={`/clientes/${client.id}`}
                      className="text-xs font-semibold text-blue-605 hover:text-blue-800 shrink-0"
                    >
                      Ver Perfil
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="min-w-0 w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Consultas Recentes</h3>
          <div className="border border-gray-200 rounded-lg bg-white p-4 sm:p-5 shadow-sm min-w-0 w-full">
            {recentConsultations.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Nenhuma consulta realizada ainda.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentConsultations.map((consultation) => {
                  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  });
                  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });

                  return (
                    <li key={consultation.id} className="flex justify-between items-center py-3 min-w-0">
                      <div className="min-w-0 pr-3 flex-1">
                        <strong className="text-sm text-gray-800 block truncate" title={consultation.client.nome}>
                          {consultation.client.nome}
                        </strong>
                        <span className="text-xs text-gray-500 block truncate mt-0.5">
                          {formattedDate} - {formattedValue}
                        </span>
                      </div>
                      <Link
                        href={`/consultas/${consultation.id}`}
                        className="text-xs font-semibold text-blue-605 hover:text-blue-800 shrink-0"
                      >
                        Ver Ficha
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
