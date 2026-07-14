"use client";

import { useEffect, useState } from "react";

interface PaymentFormFieldsProps {
  defaultMethod?: string;
  defaultStatus?: string;
  defaultTotalPago?: string;
  defaultNumeroParcelas?: string;
  valorTotal?: number; // in cents, used to prefill
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  CREDIARIO: "Crediário (parcelado)",
};

export function PaymentFormFields({
  defaultMethod = "",
  defaultTotalPago = "",
  defaultNumeroParcelas = "2",
}: PaymentFormFieldsProps) {
  const [method, setMethod] = useState(defaultMethod);
  const [hasPayment, setHasPayment] = useState(!!defaultMethod);

  useEffect(() => {
    if (!hasPayment) {
      setMethod("");
    }
  }, [hasPayment]);

  const isCrediario = method === "CREDIARIO";
  const isAVista =
    method === "DINHEIRO" ||
    method === "PIX" ||
    method === "CARTAO_CREDITO" ||
    method === "CARTAO_DEBITO";

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="hasPayment"
          checked={hasPayment}
          onChange={(e) => setHasPayment(e.target.checked)}
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
        <label htmlFor="hasPayment" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Registrar pagamento agora
        </label>
      </div>

      {hasPayment && (
        <div className="flex flex-col gap-4 pl-7">
          {/* Método */}
          <div>
            <label htmlFor="paymentMethod" className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Método de Pagamento *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              required
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full sm:max-w-xs border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Selecione...</option>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* À vista: campo de confirmação */}
          {isAVista && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              ✅ Pagamento à vista — a venda será marcada como <strong>Paga</strong> automaticamente.
            </p>
          )}

          {/* Crediário */}
          {isCrediario && (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="paymentEntrada" className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Valor de Entrada (R$)
                </label>
                <input
                  type="text"
                  id="paymentEntrada"
                  name="paymentEntrada"
                  placeholder="0,00"
                  defaultValue={defaultTotalPago}
                  className="w-full sm:max-w-xs border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Deixe em branco ou 0,00 para sem entrada.</p>
              </div>
              <div>
                <label htmlFor="paymentNumeroParcelas" className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  Número de Parcelas *
                </label>
                <select
                  id="paymentNumeroParcelas"
                  name="paymentNumeroParcelas"
                  defaultValue={defaultNumeroParcelas}
                  className="w-full sm:max-w-xs border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>{n}x mensais</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">As parcelas vencem todo mês a partir de 30 dias.</p>
              </div>
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
