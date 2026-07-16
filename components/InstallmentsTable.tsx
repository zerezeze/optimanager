"use client";

import { useTransition } from "react";
import { markInstallmentPaid } from "@/app/actions/consultations";
import { Installment } from "@prisma/client";
import { toast } from "sonner";

interface InstallmentsTableProps {
  installments: Installment[];
  consultationId: string;
}

export function InstallmentsTable({ installments, consultationId }: InstallmentsTableProps) {
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
          <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider text-xs">
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Vencimento</th>
            <th className="p-3 font-semibold text-right">Valor</th>
            <th className="p-3 font-semibold text-center">Status</th>
            <th className="p-3 font-semibold text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
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
              <tr key={inst.id} className={inst.pago ? "bg-green-50/30" : ""}>
                <td className="p-3 font-semibold text-gray-600">{inst.numero}ª</td>
                <td className="p-3">
                  <span className={inst.pago ? "text-gray-400 line-through" : "text-gray-800"}>
                    {vencimento}
                  </span>
                  {paidAt && (
                    <span className="block text-xs text-green-600 mt-0.5">
                      Pago em {paidAt}
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-semibold">
                  <span className={inst.pago ? "text-gray-400 line-through" : "text-gray-800"}>
                    {valor}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {inst.pago ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      🟢 Paga
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                      🔴 Aberta
                    </span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {!inst.pago && (
                    <button
                      onClick={() => handleMarkPaid(inst.id)}
                      disabled={isPending}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Salvando..." : "Marcar como paga"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
