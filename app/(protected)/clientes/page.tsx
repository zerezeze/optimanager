import prisma from "@/lib/db";
import Link from "next/link";
import { requireAuthenticated } from "@/lib/authz";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserX, Search, Plus, ArrowRight } from "lucide-react";

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
          mode: "insensitive" as const,
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
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Gestão de Clientes"
        description="Visualize, filtre e gerencie as informações cadastrais e atendimentos dos seus clientes."
        backHref="/dashboard"
        backLabel="Dashboard"
      >
        <Link href="/clientes/novo" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Simple Search Form */}
      <form method="GET" action="/clientes" className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="q"
          placeholder="Buscar cliente por nome..."
          defaultValue={query}
          className="flex-1 input-standard"
        />
        <div className="flex gap-3 w-full sm:w-auto">
          <Button type="submit" className="flex-1 sm:flex-initial text-xs py-2.5 px-5 shadow-sm">
            Buscar
          </Button>
          {query && (
            <Link href="/clientes" className="flex-1 sm:flex-initial">
              <Button variant="secondary" className="w-full text-xs py-2.5 px-4 shadow-sm">
                Limpar
              </Button>
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
          <Card className="p-0 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-xs font-bold">
                    <th className="p-3.5 px-5">Nome</th>
                    <th className="p-3.5 px-5">Telefone</th>
                    <th className="p-3.5 px-5">Endereço</th>
                    <th className="p-3.5 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/50">
                      <td className="p-4 px-5 font-bold text-slate-800 truncate max-w-[200px]" title={client.nome}>
                        {client.nome}
                      </td>
                      <td className="p-4 px-5">{client.telefone || "-"}</td>
                      <td className="p-4 px-5 truncate max-w-[250px]" title={client.endereco || ""}>
                        {client.endereco || "-"}
                      </td>
                      <td className="p-4 px-5 text-right whitespace-nowrap">
                        <div className="flex gap-4 justify-end">
                          <Link
                            href={`/clientes/${client.id}`}
                            className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                          >
                            Ver Perfil
                          </Link>
                          <Link
                            href={`/clientes/${client.id}/editar`}
                            className="text-slate-400 hover:text-slate-600 font-semibold transition-colors"
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
            <div className="block sm:hidden divide-y divide-slate-150">
              {clients.map((client) => (
                <div key={client.id} className="p-4 flex flex-col gap-2 bg-white">
                  <div className="flex justify-between items-start gap-2">
                    <strong className="text-sm font-bold text-slate-800 break-words">{client.nome}</strong>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cliente</span>
                  </div>
                  {client.telefone && (
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-400">Tel:</span> {client.telefone}
                    </div>
                  )}
                  {client.endereco && (
                    <div className="text-xs text-slate-500 break-words">
                      <span className="font-semibold text-slate-400">End:</span> {client.endereco}
                    </div>
                  )}
                  <div className="flex gap-4 mt-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/clientes/${client.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Ver Perfil
                    </Link>
                    <Link
                      href={`/clientes/${client.id}/editar`}
                      className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
