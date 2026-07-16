import prisma from "@/lib/db";
import Link from "next/link";
import { requireAuthenticated } from "@/lib/authz";
import { EmptyState } from "@/components/EmptyState";
import { UserX, Search } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const params = await searchParams;
  const query = params.q || "";

  const isAdmin = sessionUser.role === "ADMIN";
  const searchFilter = query
    ? {
        nome: {
          contains: query,
          mode: "insensitive" as const, // PostgreSQL case-insensitive search
        },
      }
    : {};

  const whereCondition = isAdmin
    ? searchFilter
    : {
        userId: sessionUser.id,
        ...searchFilter,
      };

  // Query database with tenancy constraint
  const clients = await prisma.client.findMany({
    where: whereCondition,
    orderBy: {
      nome: "asc",
    },
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="btn btn-secondary w-full sm:w-auto"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Dashboard
          </Link>
          <Link
            href="/clientes/novo"
            className="btn btn-primary w-full sm:w-auto"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            + Novo Cliente
          </Link>
        </div>
      </div>

      {/* Simple Search Form */}
      <form method="GET" action="/clientes" className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="q"
          placeholder="Buscar cliente por nome..."
          defaultValue={query}
          className="flex-1"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="btn btn-primary flex-1 sm:flex-initial cursor-pointer"
            style={{ padding: "10px 20px" }}
          >
            Buscar
          </button>
          {query && (
            <Link
              href="/clientes"
              className="btn btn-secondary flex-1 sm:flex-initial"
              style={{ padding: "10px 14px" }}
            >
              Limpar
            </Link>
          )}
        </div>
      </form>

      {/* Clients List/Cards */}
      <div>
        {clients.length === 0 ? (
          query ? (
            <EmptyState
              icon={Search}
              title="Nenhum cliente encontrado"
              description={`Não encontramos nenhum resultado correspondente a "${query}".`}
              actionText="Limpar busca"
              actionHref="/clientes"
            />
          ) : (
            <EmptyState
              icon={UserX}
              title="Nenhum cliente cadastrado"
              description="Sua ótica ainda não possui clientes cadastrados. Cadastre seu primeiro cliente para iniciar."
              actionText="Cadastrar Cliente"
              actionHref="/clientes/novo"
            />
          )
        ) : (
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm w-full">
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Endereço</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50/50">
                      <td className="p-4 px-4 text-sm font-bold text-gray-900 truncate max-w-[200px]" title={client.nome}>
                        {client.nome}
                      </td>
                      <td className="p-4 px-4 text-sm text-gray-600 truncate max-w-[150px]">{client.telefone || "-"}</td>
                      <td className="p-4 px-4 text-sm text-gray-600 truncate max-w-[250px]" title={client.endereco || ""}>
                        {client.endereco || "-"}
                      </td>
                      <td className="p-4 px-4 text-sm text-right whitespace-nowrap">
                        <div className="flex gap-4 justify-end">
                          <Link
                            href={`/clientes/${client.id}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Ver Perfil
                          </Link>
                          <Link
                            href={`/clientes/${client.id}/editar`}
                            className="text-gray-500 hover:text-gray-700 font-semibold"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-100">
              {clients.map((client) => (
                <div key={client.id} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <strong className="text-sm font-bold text-gray-800 break-words">{client.nome}</strong>
                    <span className="text-xs text-gray-400 shrink-0">Cliente</span>
                  </div>
                  {client.telefone && (
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-600">Tel:</span> {client.telefone}
                    </div>
                  )}
                  {client.endereco && (
                    <div className="text-xs text-gray-500 break-words">
                      <span className="font-semibold text-gray-600">End:</span> {client.endereco}
                    </div>
                  )}
                  <div className="flex gap-4 mt-2 pt-2 border-t border-gray-50">
                    <Link
                      href={`/clientes/${client.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Ver Perfil
                    </Link>
                    <Link
                      href={`/clientes/${client.id}/editar`}
                      className="text-xs text-gray-550 hover:text-gray-700 font-semibold"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
          </div>
        )}
      </div>
    </div>
  );
}
