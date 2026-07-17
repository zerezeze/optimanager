"use client";

import { updateConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";
import PrescriptionFormFields from "@/components/PrescriptionFormFields";
import { PaymentFormFields } from "@/components/PaymentFormFields";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

interface ConsultationData {
  id: string;
  clientId: string;
  data: Date;
  olhoDireito: string | null;
  olhoEsquerdo: string | null;
  adicao: string | null;
  lentes: string | null;
  laboratorio: string | null;
  medico: string | null;
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
      <SectionCard title="Pagamento">
        <div className="flex flex-col gap-4">
          {existingPaymentMethod && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-3 font-semibold leading-relaxed">
              Importante: Alterar o pagamento aqui substituirá o registro financeiro existente e apagará as parcelas antigas.
            </p>
          )}
          <PaymentFormFields defaultMethod={existingPaymentMethod} />
        </div>
      </SectionCard>

      {error && (
        <div className="text-red-600 text-sm px-1 font-semibold">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          isLoading={loading}
          className="w-full sm:flex-1 py-3 text-sm font-bold shadow-sm"
        >
          Salvar Alterações
        </Button>
        <Link href={`/consultas/${consultation.id}`} className="w-full sm:flex-1">
          <Button
            variant="secondary"
            className="w-full py-3 text-sm font-bold shadow-sm"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
