import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Consultation } from "@prisma/client";
import DeleteClientButton from "@/components/DeleteClientButton";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { requireAuthenticated } from "@/lib/authz";
import { EmptyState } from "@/components/EmptyState";
import { FileX, MessageCircle, Plus, Edit } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        include: {
          payment: {
            select: { status: true },
          },
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
    <div className="p-4 sm:p-8 max-w-4xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Navigation & Header */}
      <PageHeader
        title={client.nome}
        description="Visualize o perfil completo do cliente, informações de contato e histórico de exames realizados."
        backHref="/clientes"
        backLabel="Clientes"
      >
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href={`/clientes/${client.id}/consultas/nova`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Nova Consulta</span>
            </Button>
          </Link>
          <Link href={`/clientes/${client.id}/editar`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Button>
          </Link>
          <div className="w-full sm:w-auto">
            <DeleteClientButton clientId={client.id} />
          </div>
        </div>
      </PageHeader>

      {/* Client Profile Info Card */}
      <SectionCard title="Informações de Contato">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Telefone</strong>
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-slate-800 font-bold">{client.telefone || "Não informado"}</span>
              {client.telefone && (
                <a
                  href={getWhatsAppUrl(client.telefone, `Olá ${client.nome}, `)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800"
                  title="Conversar no WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Endereço</strong>
            <span className="text-sm text-slate-800 font-bold break-words">{client.endereco || "Não informado"}</span>
          </div>
        </div>
      </SectionCard>

      {/* Consultations History list */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Histórico de Consultas
        </h2>
        
        <div>
          {client.consultations.length === 0 ? (
            <EmptyState
              icon={FileX}
              title="Nenhuma consulta cadastrada"
              description="Este cliente ainda não possui nenhuma consulta óptica registrada."
              actionText="+ Cadastrar Consulta"
              actionHref={`/clientes/${client.id}/consultas/nova`}
            />
          ) : (
            <Card className="p-0 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-3.5 px-4">Data</th>
                      <th className="p-3.5 px-4">Graus (OD / OE)</th>
                      <th className="p-3.5 px-4">Lentes</th>
                      <th className="p-3.5 px-4">Valor</th>
                      <th className="p-3.5 px-4">Pagamento</th>
                      <th className="p-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
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
                        <tr key={consultation.id} className="hover:bg-slate-50/50">
                          <td className="p-4 px-4 font-bold text-slate-800">
                            {formattedDate}
                            {consultation.ordemServico && (
                              <span className="block text-[10px] text-blue-600 font-bold mt-0.5">
                                O.S.: {consultation.ordemServico}
                              </span>
                            )}
                          </td>
                          <td className="p-4 px-4 truncate max-w-[150px]" title={grauSummary}>
                            {grauSummary}
                          </td>
                          <td className="p-4 px-4 truncate max-w-[150px]" title={consultation.lentes || ""}>
                            {consultation.lentes || "-"}
                          </td>
                          <td className="p-4 px-4 font-bold text-slate-800">{formattedValue}</td>
                          <td className="p-4 px-4">
                            <PaymentStatusBadge status={(consultation as any).payment?.status ?? null} />
                          </td>
                          <td className="p-4 px-4 text-right whitespace-nowrap">
                            <Link
                              href={`/consultas/${consultation.id}`}
                              className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
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
              <div className="block sm:hidden divide-y divide-slate-150">
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
                    <div key={consultation.id} className="p-4 flex flex-col gap-2 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <strong className="text-sm font-bold text-slate-800">{formattedDate}</strong>
                          {consultation.ordemServico && (
                            <span className="text-[10px] text-blue-600 font-bold mt-0.5">
                              O.S.: {consultation.ordemServico}
                            </span>
                          )}
                        </div>
                        <strong className="text-sm text-slate-800 font-bold">{formattedValue}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-1">
                        <div>
                          <span className="font-semibold text-slate-400 block">Graus (OD/OE):</span>
                          <span className="truncate block font-bold text-slate-700" title={grauSummary}>
                            {grauSummary}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400 block">Lentes:</span>
                          <span className="truncate block font-bold text-slate-700" title={consultation.lentes || ""}>
                            {consultation.lentes || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 pt-2 border-t border-slate-100">
                        <Link
                          href={`/consultas/${consultation.id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
