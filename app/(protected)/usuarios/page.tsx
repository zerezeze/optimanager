import prisma from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/authz";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserX, Plus } from "lucide-react";

export default async function UsuariosListPage() {
  // Enforce ADMIN permission at the server component level
  await requireAdmin();

  // Fetch all users ordered by creation date
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Header Area */}
      <PageHeader
        title="Gestão de Usuários"
        description="Administração de operadores, credenciais e permissões de acesso ao sistema."
        backHref="/dashboard"
        backLabel="Dashboard"
      >
        <Link href="/usuarios/novo" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Usuário</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Users List Container */}
      <div>
        {users.length === 0 ? (
          <EmptyState
            icon={UserX}
            title="Nenhum usuário cadastrado"
            description="Não há operadores cadastrados no sistema. Cadastre um novo operador para liberar acesso."
            actionText="+ Novo Usuário"
            actionHref="/usuarios/novo"
          />
        ) : (
          <Card className="p-0 overflow-hidden">
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="p-3.5 px-4">Nome</th>
                    <th className="p-3.5 px-4">E-mail</th>
                    <th className="p-3.5 px-4">Perfil</th>
                    <th className="p-3.5 px-4">Criado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {users.map((u) => {
                    const createdDate = new Date(u.createdAt).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    });

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="p-4 px-4 font-bold text-slate-800">{u.name}</td>
                        <td className="p-4 px-4">{u.email}</td>
                        <td className="p-4 px-4">
                          <Badge variant={u.role === "ADMIN" ? "info" : "neutral"}>
                            {u.role === "ADMIN" ? "Administrador" : "Operador"}
                          </Badge>
                        </td>
                        <td className="p-4 px-4 text-slate-400">{createdDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (hidden on desktop) */}
            <div className="block sm:hidden divide-y divide-slate-150">
              {users.map((u) => {
                const createdDate = new Date(u.createdAt).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                });

                return (
                  <div key={u.id} className="p-4 flex flex-col gap-2 bg-white">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-slate-800">{u.name}</strong>
                      <Badge variant={u.role === "ADMIN" ? "info" : "neutral"}>
                        {u.role === "ADMIN" ? "Administrador" : "Operador"}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5 text-xs text-slate-500 mt-1">
                      <div>
                        <span className="font-semibold text-slate-400">E-mail:</span> {u.email}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400">Criado em:</span> {createdDate}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
