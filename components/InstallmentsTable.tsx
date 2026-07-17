"use client";

import { useTransition } from "react";
import { markInstallmentPaid } from "@/app/actions/consultations";
import { Installment } from "@prisma/client";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface InstallmentsTableProps {
  installments: Installment[];
  consultationId: string;
  clientPhone?: string | null;
  clientNome?: string;
}

export function InstallmentsTable({
  installments,
  consultationId,
  clientPhone,
  clientNome,
}: InstallmentsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkPaid = (installmentId: string) => {
    startTransition(async () => {
      try {
        await markInstallmentPaid(installmentId, consultationId);
        toast.success("Parcela baixada com sucesso!");
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        toast.error(err.message || "Erro ao atualizar a parcela.");
      }
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
            <th className="p-3 px-4">#</th>
            <th className="p-3 px-4">Vencimento</th>
            <th className="p-3 px-4 text-right">Valor</th>
            <th className="p-3 px-4 text-center">Status</th>
            <th className="p-3 px-4 text-right no-print">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
          {installments.map((inst) => {
            const vencimento = new Date(inst.vencimento).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            });
            const valor = (inst.valor / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
            const paidAt = inst.paidAt
              ? new Date(inst.paidAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })
              : null;

            return (
              <tr key={inst.id} className={inst.pago ? "bg-green-50/10" : "hover:bg-slate-50/20"}>
                <td className="p-3 px-4 font-bold text-slate-400">{inst.numero}ª</td>
                <td className="p-3 px-4">
                  <span className={inst.pago ? "text-slate-400 line-through" : "text-slate-800"}>
                    {vencimento}
                  </span>
                  {paidAt && (
                    <span className="block text-[10px] text-green-600 font-semibold mt-0.5">
                      Pago em {paidAt}
                    </span>
                  )}
                </td>
                <td className="p-3 px-4 text-right font-bold">
                  <span className={inst.pago ? "text-slate-400 line-through" : "text-slate-800"}>
                    {valor}
                  </span>
                </td>
                <td className="p-3 px-4 text-center">
                  {inst.pago ? (
                    <Badge variant="success">Paga</Badge>
                  ) : (
                    <Badge variant="danger">Aberta</Badge>
                  )}
                </td>
                <td className="p-3 px-4 text-right no-print">
                  <div className="flex items-center justify-end gap-3">
                    {!inst.pago && clientPhone && (
                      <a
                        href={getWhatsAppUrl(
                          clientPhone,
                          `Olá ${clientNome || "cliente"}, lembramos que sua ${inst.numero}ª parcela no valor de ${valor} vence em ${vencimento}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800"
                        title="Enviar cobrança via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Cobrar</span>
                      </a>
                    )}
                    {!inst.pago && (
                      <Button
                        variant="ghost"
                        onClick={() => handleMarkPaid(inst.id)}
                        disabled={isPending}
                        className="py-1 px-2.5 text-xs font-bold"
                      >
                        {isPending ? "Salvando..." : "Baixar"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
