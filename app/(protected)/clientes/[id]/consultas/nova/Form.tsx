"use client";

import { createConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";
import PrescriptionFormFields from "@/components/PrescriptionFormFields";
import { PaymentFormFields } from "@/components/PaymentFormFields";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

interface NovaFormProps {
  clientId: string;
}

export default function NovaForm({ clientId }: NovaFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createConsultation(clientId, formData);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Consulta cadastrada com sucesso.");
        throw err;
      }
      setError(err.message || "Não foi possível cadastrar a consulta.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <PrescriptionFormFields />

      {/* Payment Section */}
      <SectionCard title="Pagamento">
        <PaymentFormFields />
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
          Salvar Consulta
        </Button>
        <Link href={`/clientes/${clientId}`} className="w-full sm:flex-1">
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
