import prisma from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/authz";
import { EmptyState } from "@/components/EmptyState";
import { UserX } from "lucide-react";

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
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">Administração de operadores e credenciais</p>
        </div>
        <Link
          href="/usuarios/novo"
          className="btn btn-primary w-full sm:w-auto"
          style={{ padding: "10px 20px", fontSize: "14px" }}
        >
          + Novo Usuário
        </Link>
      </div>

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
          <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm w-full">
            <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Perfil</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Criado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => {
                    const createdDate = new Date(u.createdAt).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    });

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="p-4 px-4 text-sm font-bold text-gray-900">{u.name}</td>
                        <td className="p-4 px-4 text-sm text-gray-600">{u.email}</td>
                        <td className="p-4 px-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              u.role === "ADMIN"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-gray-50 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {u.role === "ADMIN" ? "Administrador" : "Operador"}
                          </span>
                        </td>
                        <td className="p-4 px-4 text-sm text-gray-500">{createdDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (hidden on desktop) */}
            <div className="block sm:hidden divide-y divide-gray-100">
              {users.map((u) => {
                const createdDate = new Date(u.createdAt).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                });

                return (
                  <div key={u.id} className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-gray-900">{u.name}</strong>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {u.role === "ADMIN" ? "Administrador" : "Operador"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-xs text-gray-500 mt-1">
                      <div>
                        <span className="font-semibold text-gray-600">E-mail:</span> {u.email}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Criado em:</span> {createdDate}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
          </div>
        )}
      </div>
    </div>
  );
}
