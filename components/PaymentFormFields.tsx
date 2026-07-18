"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

interface PaymentFormFieldsProps {
  defaultMethod?: string;
  defaultTotalPago?: string;
  defaultNumeroParcelas?: string;
  valorTotal?: number; // in cents, passed from parent (e.g. 15000)
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  CREDIARIO: "Crediário (parcelado)",
};

function parseBRLToCents(valStr: string): number {
  let clean = valStr.trim();
  clean = clean.replace(/\s/g, "");
  if (clean.includes(",")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed < 0 ? 0 : Math.round(parsed * 100);
}

export function PaymentFormFields({
  defaultMethod = "",
  defaultTotalPago = "",
  defaultNumeroParcelas = "2",
  valorTotal = 0, // default to 0
}: PaymentFormFieldsProps) {
  const [method, setMethod] = useState(defaultMethod);
  const [hasPayment, setHasPayment] = useState(!!defaultMethod);
  const [totalPagoStr, setTotalPagoStr] = useState(defaultTotalPago);

  // Synced from checkbox toggle
  useEffect(() => {
    if (!hasPayment) {
      setMethod("");
      setTotalPagoStr("");
    }
  }, [hasPayment]);

  const isCrediario = method === "CREDIARIO";

  // Parse values in cents
  const totalPagoCentavos = parseBRLToCents(totalPagoStr);
  const isOverpaid = totalPagoCentavos > valorTotal;

  // Deriving Status dynamically
  let derivedStatus: "PAGO" | "PARCIAL" | "PENDENTE" = "PENDENTE";
  if (totalPagoCentavos === valorTotal && valorTotal > 0) {
    derivedStatus = "PAGO";
  } else if (totalPagoCentavos > 0 && totalPagoCentavos < valorTotal) {
    derivedStatus = "PARCIAL";
  }

  // Derived Saldo Restante
  const saldoRestanteCentavos = Math.max(0, valorTotal - totalPagoCentavos);
  const formattedSaldoRestante = (saldoRestanteCentavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedValorTotal = (valorTotal / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="hasPayment"
          checked={hasPayment}
          onChange={(e) => setHasPayment(e.target.checked)}
          className="w-4 h-4 cursor-pointer text-blue-600 focus:ring-blue-500/20 border-slate-300 rounded"
        />
        <label htmlFor="hasPayment" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
          Registrar pagamento agora
        </label>
      </div>

      {hasPayment && (
        <div className="flex flex-col gap-4 pl-7 border-l-2 border-slate-100">
          
          {/* Valor Total da Consulta (Espelhado) */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Valor Total da Consulta (Lido da Receita)
            </span>
            <span className="text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5 inline-block min-w-[120px]">
              {formattedValorTotal}
            </span>
          </div>

          {/* Método */}
          <div>
            <label htmlFor="paymentMethod" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Método de Pagamento *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full sm:max-w-xs input-standard"
            >
              <option value="" disabled>Selecione...</option>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {method && (
            <div className="flex flex-col gap-4 mt-1">
              {/* Valor Pago / Entrada */}
              <div>
                <label htmlFor="paymentTotalPago" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isCrediario ? "Valor de Entrada (R$)" : "Valor Pago (R$)"}
                </label>
                <input
                  type="text"
                  id="paymentTotalPago"
                  name="paymentTotalPago"
                  placeholder="0,00"
                  value={totalPagoStr}
                  onChange={(e) => setTotalPagoStr(e.target.value)}
                  className={`w-full sm:max-w-xs input-standard ${isOverpaid ? "border-red-500 focus:ring-red-500/20" : ""}`}
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {isCrediario ? "Deixe em branco ou 0,00 para sem entrada." : "Valor a ser pago agora."}
                </p>
              </div>

              {/* Status do Pagamento (Calculado) */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Status do Pagamento (Calculado)
                </span>
                <div className="flex items-center gap-2">
                  {derivedStatus === "PAGO" && <Badge variant="success">Pago</Badge>}
                  {derivedStatus === "PARCIAL" && <Badge variant="warning">Parcial</Badge>}
                  {derivedStatus === "PENDENTE" && <Badge variant="danger">Não pago</Badge>}
                  
                  {derivedStatus === "PAGO" && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      <span>Pagamento quitado</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Saldo Restante */}
              {derivedStatus !== "PAGO" && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Saldo Restante
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {formattedSaldoRestante}
                  </span>
                </div>
              )}

              {/* Error Warning */}
              {isOverpaid && (
                <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 max-w-sm">
                  O valor pago não pode ser maior que o valor total.
                </p>
              )}

              {/* Crediário - Parcelas */}
              {isCrediario && derivedStatus !== "PAGO" && (
                <div>
                  <label htmlFor="paymentNumeroParcelas" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Número de Parcelas *
                  </label>
                  <select
                    id="paymentNumeroParcelas"
                    name="paymentNumeroParcelas"
                    defaultValue={defaultNumeroParcelas}
                    className="w-full sm:max-w-xs input-standard"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>{n}x mensais</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    As parcelas do crediário começam a vencer em 30 dias.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hidden fields to always submit state */}
      <input type="hidden" name="registerPayment" value={hasPayment ? "true" : "false"} />
      {hasPayment && <input type="hidden" name="paymentMethodValue" value={method} />}
    </div>
  );
}
