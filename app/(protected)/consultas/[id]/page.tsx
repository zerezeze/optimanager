import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuthenticated } from "@/lib/authz";
import { DeleteConsultationButton } from "./DeleteConsultationButton";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { InstallmentsTable } from "@/components/InstallmentsTable";
import { MessageCircle, Printer, FileText } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { PrintActions } from "./PrintActions";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

  const prescriptionData = {
    clientNome: consultation.client.nome,
    clientTelefone: consultation.client.telefone,
    data: formattedDate,
    medico: consultation.medico,
    adicao: consultation.adicao,
    lentes: consultation.lentes,
    laboratorio: consultation.laboratorio,
    ordemServico: consultation.ordemServico,
    observacao: consultation.observacao,
    odEsferico: consultation.odEsferico,
    odCilindrico: consultation.odCilindrico,
    odEixo: consultation.odEixo,
    odDnp: consultation.odDnp,
    odAltura: consultation.odAltura,
    oeEsferico: consultation.oeEsferico,
    oeCilindrico: consultation.oeCilindrico,
    oeEixo: consultation.oeEixo,
    oeDnp: consultation.oeDnp,
    oeAltura: consultation.oeAltura,
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Ficha da Consulta"
        description={`Cliente: ${consultation.client.nome}`}
        backHref={`/clientes/${consultation.clientId}`}
        backLabel="Voltar ao Perfil"
      >
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          {consultation.client.telefone && (
            <a
              href={getWhatsAppUrl(consultation.client.telefone, `Olá ${consultation.client.nome}, `)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto shrink-0"
            >
              <Button variant="secondary" className="w-full text-xs py-2 px-3.5 shadow-sm text-green-700 hover:text-green-800">
                <MessageCircle className="w-4 h-4" />
                <span>Conversar</span>
              </Button>
            </a>
          )}
          <Link href={`/consultas/${consultation.id}/editar`} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-xs py-2 px-3.5 shadow-sm">
              <span>Editar Consulta</span>
            </Button>
          </Link>
          <div className="w-full sm:w-auto shrink-0">
            <DeleteConsultationButton consultationId={consultation.id} />
          </div>
        </div>
      </PageHeader>

      {/* Print and PDF actions toolbar */}
      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col gap-3 no-print">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documentos e Impressão</span>
        <PrintActions data={prescriptionData} />
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* CARD 0: ORDEM DE SERVIÇO */}
        {consultation.ordemServico && (
          <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/20 shadow-sm w-full flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Ordem de Serviço (O.S.)</span>
              <strong className="text-base text-blue-700">{consultation.ordemServico}</strong>
            </div>
            <div className="flex items-center gap-2">
              {consultation.client.telefone && (
                <a
                  href={getWhatsAppUrl(
                    consultation.client.telefone,
                    `Olá ${consultation.client.nome}, seus óculos da O.S. ${consultation.ordemServico} já estão prontos na Ótica Everardo! Pode vir buscar.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0"
                >
                  <Button className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs py-1.5 px-3 rounded-lg border-none shadow-sm font-semibold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Avisar O.S. Pronta</span>
                  </Button>
                </a>
              )}
              <div className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-wider">
                Laboratório / Ótica
              </div>
            </div>
          </div>
        )}

        {/* CARD 1: RECEITA OFTALMOLÓGICA */}
        <div className="print-section-refractive">
          <SectionCard title="Receita Oftalmológica">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-center text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="p-3 font-bold text-left">Olho</th>
                    <th className="p-3 font-semibold">Esférico</th>
                    <th className="p-3 font-semibold">Cilíndrico</th>
                    <th className="p-3 font-semibold">Eixo</th>
                    <th className="p-3 font-semibold">DNP</th>
                    <th className="p-3 font-semibold">Altura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-left text-slate-400">OD (Direito)</td>
                    <td className="p-3">{consultation.odEsferico || "-"}</td>
                    <td className="p-3">{consultation.odCilindrico || "-"}</td>
                    <td className="p-3">{consultation.odEixo ? `${consultation.odEixo}°` : "-"}</td>
                    <td className="p-3">{consultation.odDnp ? `${consultation.odDnp} mm` : "-"}</td>
                    <td className="p-3">{consultation.odAltura ? `${consultation.odAltura} mm` : "-"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-left text-slate-400">OE (Esquerdo)</td>
                    <td className="p-3">{consultation.oeEsferico || "-"}</td>
                    <td className="p-3">{consultation.oeCilindrico || "-"}</td>
                    <td className="p-3">{consultation.oeEixo ? `${consultation.oeEixo}°` : "-"}</td>
                    <td className="p-3">{consultation.oeDnp ? `${consultation.oeDnp} mm` : "-"}</td>
                    <td className="p-3">{consultation.oeAltura ? `${consultation.oeAltura} mm` : "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm justify-start pl-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Adição:</span>
              <span className="font-extrabold text-blue-600 text-base">{consultation.adicao || "-"}</span>
            </div>
          </SectionCard>
        </div>

        {/* CARD 2: DADOS DA RECEITA / COMERCIAIS */}
        <SectionCard title="Dados da Receita">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-3.5">
            <div>
              <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Médico</strong>
              <span className="text-sm text-slate-800 font-bold">{consultation.medico || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Data da Consulta</strong>
              <span className="text-sm text-slate-800 font-bold">{formattedDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-3.5">
            <div>
              <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Laboratório</strong>
              <span className="text-sm text-slate-800 font-bold">{consultation.laboratorio || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Lentes</strong>
              <span className="text-sm text-slate-800 font-bold">{consultation.lentes || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Valor</strong>
              <span className="text-sm text-slate-800 font-bold">{formattedValue}</span>
            </div>
          </div>

          <div className="border-b border-slate-100 pb-3.5">
            <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Observações</strong>
            <span className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed block bg-slate-50 border border-slate-100 p-3 rounded-lg mt-1 font-medium">
              {consultation.observacao || "Não informado"}
            </span>
          </div>

          <div>
            <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Ordem de Serviço</strong>
            <span className="text-sm text-slate-800 font-bold block mt-1">
              {consultation.ordemServico || "Não informado"}
            </span>
          </div>
        </SectionCard>

        {/* CARD 3: SITUAÇÃO FINANCEIRA */}
        <div className="print-section-financial">
          <SectionCard
            title="Situação Financeira"
            action={consultation.payment && <PaymentStatusBadge status={consultation.payment.status} />}
          >
            {!consultation.payment ? (
              <p className="text-sm text-slate-400 italic py-2">Nenhum pagamento registrado para esta consulta.</p>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Método</strong>
                    <span className="text-sm text-slate-800 font-bold">
                      {PAYMENT_METHOD_LABELS[consultation.payment.method] ?? consultation.payment.method}
                    </span>
                  </div>
                  <div>
                    <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Total Pago</strong>
                    <span className="text-sm text-slate-800 font-bold">
                      {(() => {
                        const paidInstallmentsSum = consultation.payment!.installments
                          .filter((i) => i.pago)
                          .reduce((sum, i) => sum + i.valor, 0);
                        const effectivePaid = consultation.payment!.totalPago + paidInstallmentsSum;
                        return (effectivePaid / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                      })()}
                    </span>
                  </div>
                  <div>
                    <strong className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1 font-bold">Saldo Devedor</strong>
                    <span className="text-sm font-extrabold text-red-600">
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
                  <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parcelas do Crediário</h3>
                    <InstallmentsTable
                      installments={consultation.payment.installments}
                      consultationId={consultation.id}
                      clientPhone={consultation.client.telefone}
                      clientNome={consultation.client.nome}
                    />
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
