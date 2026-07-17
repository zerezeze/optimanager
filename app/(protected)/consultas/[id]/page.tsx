import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuthenticated } from "@/lib/authz";
import { DeleteConsultationButton } from "./DeleteConsultationButton";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { InstallmentsTable } from "@/components/InstallmentsTable";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  CREDIARIO: "Crediário",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultaDetalhesPage({ params }: PageProps) {
  const sessionUser = await requireAuthenticated();
  
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: {
      client: true,
      payment: {
        include: {
          installments: {
            orderBy: { numero: "asc" },
          },
        },
      },
    },
  });

  if (!consultation) {
    notFound();
  }

  // Multi-tenant permission check
  if (sessionUser.role !== "ADMIN" && consultation.client.userId !== sessionUser.id) {
    notFound();
  }

  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Link
          href={`/clientes/${consultation.clientId}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <span className="hidden sm:inline">&larr; Voltar para Perfil de {consultation.client.nome}</span>
          <span className="inline sm:hidden">&larr; Voltar ao Perfil</span>
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DeleteConsultationButton consultationId={consultation.id} />
          <Link
            href={`/consultas/${consultation.id}/editar`}
            className="btn btn-secondary w-full sm:w-auto"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Editar Consulta
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha da Consulta</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              Cliente: <strong className="text-gray-700">{consultation.client.nome}</strong>
            </span>
            {consultation.client.telefone && (
              <a
                href={getWhatsAppUrl(consultation.client.telefone, `Olá ${consultation.client.nome}, `)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-semibold"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Conversar</span>
              </a>
            )}
          </div>
        </div>

        {/* CARD 0: ORDEM DE SERVIÇO */}
        {consultation.ordemServico && (
          <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/50 shadow-sm w-full flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-xs text-gray-500 block uppercase tracking-wider mb-0.5">Ordem de Serviço (O.S.)</span>
              <strong className="text-base text-blue-700">{consultation.ordemServico}</strong>
            </div>
            <div className="flex items-center gap-3">
              {consultation.client.telefone && (
                <a
                  href={getWhatsAppUrl(
                    consultation.client.telefone,
                    `Olá ${consultation.client.nome}, seus óculos da O.S. ${consultation.ordemServico} já estão prontos na Ótica Everardo! Pode vir buscar.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-green-600 hover:bg-green-700 active:bg-green-800 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border-none cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Avisar O.S. Pronta</span>
                </a>
              )}
              <div className="text-xs text-gray-400 bg-white border border-gray-150 rounded px-2.5 py-1.5 font-medium">
                Laboratório / Ótica
              </div>
            </div>
          </div>
        )}

        {/* CARD 1: RECEITA OFTALMOLÓGICA */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 mb-4 text-center tracking-wide">
            RECEITA OFTALMOLÓGICA
          </h2>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
                  <th className="p-3 font-bold text-gray-700 text-left">Olho</th>
                  <th className="p-3 font-semibold">Esférico</th>
                  <th className="p-3 font-semibold">Cilíndrico</th>
                  <th className="p-3 font-semibold">Eixo</th>
                  <th className="p-3 font-semibold">DNP</th>
                  <th className="p-3 font-semibold">Altura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800 font-medium">
                <tr>
                  <td className="p-3 font-bold text-left text-gray-500">OD (Direito)</td>
                  <td className="p-3">{consultation.odEsferico || "-"}</td>
                  <td className="p-3">{consultation.odCilindrico || "-"}</td>
                  <td className="p-3">{consultation.odEixo ? `${consultation.odEixo}°` : "-"}</td>
                  <td className="p-3">{consultation.odDnp ? `${consultation.odDnp} mm` : "-"}</td>
                  <td className="p-3">{consultation.odAltura ? `${consultation.odAltura} mm` : "-"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-left text-gray-500">OE (Esquerdo)</td>
                  <td className="p-3">{consultation.oeEsferico || "-"}</td>
                  <td className="p-3">{consultation.oeCilindrico || "-"}</td>
                  <td className="p-3">{consultation.oeEixo ? `${consultation.oeEixo}°` : "-"}</td>
                  <td className="p-3">{consultation.oeDnp ? `${consultation.oeDnp} mm` : "-"}</td>
                  <td className="p-3">{consultation.oeAltura ? `${consultation.oeAltura} mm` : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm justify-start pl-2">
            <span className="text-gray-500 font-semibold">Adição:</span>
            <span className="font-bold text-blue-600 text-base">{consultation.adicao || "-"}</span>
          </div>
        </div>

        {/* CARD 2: DADOS DA RECEITA / COMERCIAIS */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full flex flex-col gap-4">
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2">
            Dados da Receita
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <span>👨‍⚕️</span> Médico
              </strong>
              <span className="text-sm text-gray-800 font-semibold">{consultation.medico || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <span>📅</span> Data da Consulta
              </strong>
              <span className="text-sm text-gray-800 font-semibold">{formattedDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-3">
            <div>
              <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <span>🏭</span> Laboratório
              </strong>
              <span className="text-sm text-gray-800 font-semibold">{consultation.laboratorio || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <span>👓</span> Lentes
              </strong>
              <span className="text-sm text-gray-800 font-semibold">{consultation.lentes || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <span>💰</span> Valor
              </strong>
              <span className="text-sm text-gray-800 font-semibold">{formattedValue}</span>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
              <span>📝</span> Observações
            </strong>
            <span className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed block bg-gray-50 p-3 rounded border border-gray-100 mt-1">
              {consultation.observacao || "Não informado"}
            </span>
          </div>

          <div>
            <strong className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
              <span>📄</span> Ordem de Serviço
            </strong>
            <span className="text-sm text-gray-800 font-semibold block mt-1">
              {consultation.ordemServico || "Não informado"}
            </span>
          </div>
        </div>
        {/* CARD 3: SITUAÇÃO FINANCEIRA */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-lg font-bold text-blue-600">Situação Financeira</h2>
            {consultation.payment && <PaymentStatusBadge status={consultation.payment.status} />}
          </div>

          {!consultation.payment ? (
            <p className="text-sm text-gray-400 italic">Nenhum pagamento registrado para esta consulta.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Método</strong>
                  <span className="text-sm text-gray-800 font-semibold">
                    {PAYMENT_METHOD_LABELS[consultation.payment.method] ?? consultation.payment.method}
                  </span>
                </div>
                <div>
                  <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Total Pago</strong>
                  <span className="text-sm text-gray-800 font-semibold">
                    {(() => {
                      // totalPago = entrada. Effective paid = entrada + sum of paid installments.
                      const paidInstallmentsSum = consultation.payment!.installments
                        .filter((i) => i.pago)
                        .reduce((sum, i) => sum + i.valor, 0);
                      const effectivePaid = consultation.payment!.totalPago + paidInstallmentsSum;
                      return (effectivePaid / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    })()}
                  </span>
                </div>
                <div>
                  <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Saldo Devedor</strong>
                  <span className="text-sm font-semibold text-red-600">
                    {(() => {
                      const paidInstallmentsSum = consultation.payment!.installments
                        .filter((i) => i.pago)
                        .reduce((sum, i) => sum + i.valor, 0);
                      const effectivePaid = consultation.payment!.totalPago + paidInstallmentsSum;
                      const saldo = consultation.valor - effectivePaid;
                      return (Math.max(0, saldo) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                    })()}
                  </span>
                </div>
              </div>


              {consultation.payment.installments.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Parcelas do Crediário</h3>
                  <InstallmentsTable
                    installments={consultation.payment.installments}
                    consultationId={consultation.id}
                    clientPhone={consultation.client.telefone}
                    clientNome={consultation.client.nome}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
