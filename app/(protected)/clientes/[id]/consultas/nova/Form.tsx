"use client";

import { createConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";
import PrescriptionFormFields from "@/components/PrescriptionFormFields";
import { PaymentFormFields } from "@/components/PaymentFormFields";

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
      // Rethrow redirect errors so Next.js handles them natively
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setError(err.message || "Ocorreu um erro ao cadastrar a consulta.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <PrescriptionFormFields />

      {/* Payment Section */}
      <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">Pagamento</h3>
        <PaymentFormFields />
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
          {loading ? "Salvando..." : "Salvar Consulta"}
        </button>
        <Link
          href={`/clientes/${clientId}`}
          className="btn btn-secondary w-full sm:flex-1 py-3 text-center"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
