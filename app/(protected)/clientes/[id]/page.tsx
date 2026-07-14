import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Consultation } from "@prisma/client";
import DeleteClientButton from "@/components/DeleteClientButton";

import { requireAuthenticated } from "@/lib/authz";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientePerfilPage({ params }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      consultations: {
        orderBy: {
          data: "desc",
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  // Multi-tenant permission check
  if (sessionUser.role !== "ADMIN" && client.userId !== sessionUser.id) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto font-sans w-full">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <Link href="/clientes" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
          &larr; Voltar para Clientes
        </Link>
        <Link
          href={`/clientes/${client.id}/consultas/nova`}
          className="btn btn-primary w-full sm:w-auto"
          style={{ padding: "8px 16px", fontSize: "14px" }}
        >
          + Nova Consulta
        </Link>
      </div>

      {/* Client Profile Info Card */}
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm mb-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 break-words max-w-full">{client.nome}</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href={`/clientes/${client.id}/editar`}
              className="btn btn-secondary flex-1 sm:flex-initial"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Editar
            </Link>
            <div className="flex-1 sm:flex-initial">
              <DeleteClientButton clientId={client.id} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Telefone</strong>
            <span className="text-sm text-gray-800 font-medium">{client.telefone || "Não informado"}</span>
          </div>
          <div>
            <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Endereço</strong>
            <span className="text-sm text-gray-800 font-medium break-words">{client.endereco || "Não informado"}</span>
          </div>
        </div>
      </div>

      {/* Consultations History list */}
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Histórico de Consultas</h2>
      
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm w-full">
        {client.consultations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma consulta realizada para este cliente.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Graus (OD / OE)</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lentes</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="p-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {client.consultations.map((consultation: Consultation) => {
                    const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                      timeZone: "UTC", // Keep UTC time matching database storage safely
                    });
                    const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
                    
                    const grauSummary = consultation.odEsferico || consultation.oeEsferico
                      ? `${consultation.odEsferico || "PLANO"} / ${consultation.oeEsferico || "PLANO"}`
                      : "-";

                    return (
                      <tr key={consultation.id} className="hover:bg-gray-50/50">
                        <td className="p-4 px-4 text-sm font-bold text-gray-800">{formattedDate}</td>
                        <td className="p-4 px-4 text-sm text-gray-600 truncate max-w-[150px]" title={grauSummary}>
                          {grauSummary}
                        </td>
                        <td className="p-4 px-4 text-sm text-gray-600 truncate max-w-[150px]" title={consultation.lentes || ""}>
                          {consultation.lentes || "-"}
                        </td>
                        <td className="p-4 px-4 text-sm font-semibold text-gray-800">{formattedValue}</td>
                        <td className="p-4 px-4 text-sm text-right whitespace-nowrap">
                          <Link
                            href={`/consultas/${consultation.id}`}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-100">
              {client.consultations.map((consultation: Consultation) => {
                const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                });
                const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });

                const grauSummary = consultation.odEsferico || consultation.oeEsferico
                  ? `${consultation.odEsferico || "PLANO"} / ${consultation.oeEsferico || "PLANO"}`
                  : "-";

                return (
                  <div key={consultation.id} className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-gray-800">{formattedDate}</strong>
                      <strong className="text-sm text-gray-800">{formattedValue}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-1">
                      <div>
                        <span className="font-semibold text-gray-600 block">Graus (OD/OE):</span>
                        <span className="truncate block" title={grauSummary}>
                          {grauSummary}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 block">Lentes:</span>
                        <span className="truncate block" title={consultation.lentes || ""}>
                          {consultation.lentes || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 pt-2 border-t border-gray-50">
                      <Link
                        href={`/consultas/${consultation.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
