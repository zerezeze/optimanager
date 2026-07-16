"use client";

import { updateConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";
import PrescriptionFormFields from "@/components/PrescriptionFormFields";
import { PaymentFormFields } from "@/components/PaymentFormFields";
import { toast } from "sonner";

interface ConsultationData {
  id: string;
  clientId: string;
  data: Date;
  olhoDireito: string | null;
  olhoEsquerdo: string | null;
  adicao: string | null;
  lentes: string | null;
  laboratorio: string | null;
  valor: number;
  observacao: string | null;
  ordemServico: string | null;
  // Novos campos
  odEsferico: string | null;
  odCilindrico: string | null;
  odEixo: string | null;
  odDnp: string | null;
  odAltura: string | null;
  oeEsferico: string | null;
  oeCilindrico: string | null;
  oeEixo: string | null;
  oeDnp: string | null;
  oeAltura: string | null;
}

interface EditarFormProps {
  consultation: ConsultationData;
  existingPaymentMethod?: string;
}

export default function EditarForm({ consultation, existingPaymentMethod }: EditarFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await updateConsultation(consultation.id, formData);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Consulta atualizada com sucesso.");
        throw err;
      }
      setError(err.message || "Não foi possível salvar as alterações da consulta.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <PrescriptionFormFields defaultValue={consultation} />

      {/* Payment Section */}
      <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">Pagamento</h3>
        {existingPaymentMethod && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            ⚠️ Alterar o pagamento aqui <strong>substituirá</strong> o registro financeiro existente e apagará as parcelas antigas.
          </p>
        )}
        <PaymentFormFields defaultMethod={existingPaymentMethod} />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full sm:flex-1 py-3"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <Link
          href={`/consultas/${consultation.id}`}
          className="btn btn-secondary w-full sm:flex-1 py-3 text-center"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
