"use client";

import { updateConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";

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
}

interface EditarFormProps {
  consultation: ConsultationData;
}

export default function EditarForm({ consultation }: EditarFormProps) {
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
      setError(err.message || "Ocorreu um erro ao atualizar a consulta.");
      setLoading(false);
    }
  };

  // Convert Date object to YYYY-MM-DD for the input type="date"
  const formattedInputDate = new Date(consultation.data).toISOString().substring(0, 10);
  
  // Format valor (in cents) as decimal string (e.g., "150.00")
  const formattedInputValue = (consultation.valor / 100).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="data" className="text-sm font-semibold text-gray-600">
          Data da Consulta
        </label>
        <input
          id="data"
          name="data"
          type="date"
          defaultValue={formattedInputDate}
        />
      </div>

      {/* Olho Direito */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="olhoDireito" className="text-sm font-semibold text-gray-600">
          Olho Direito
        </label>
        <input
          id="olhoDireito"
          name="olhoDireito"
          type="text"
          defaultValue={consultation.olhoDireito || ""}
          maxLength={50}
        />
      </div>

      {/* Olho Esquerdo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="olhoEsquerdo" className="text-sm font-semibold text-gray-600">
          Olho Esquerdo
        </label>
        <input
          id="olhoEsquerdo"
          name="olhoEsquerdo"
          type="text"
          defaultValue={consultation.olhoEsquerdo || ""}
          maxLength={50}
        />
      </div>

      {/* Adição */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="adicao" className="text-sm font-semibold text-gray-600">
          Adição
        </label>
        <input
          id="adicao"
          name="adicao"
          type="text"
          defaultValue={consultation.adicao || ""}
          maxLength={50}
        />
      </div>

      {/* Lentes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lentes" className="text-sm font-semibold text-gray-600">
          Lentes
        </label>
        <input
          id="lentes"
          name="lentes"
          type="text"
          defaultValue={consultation.lentes || ""}
          maxLength={255}
        />
      </div>

      {/* Laboratório */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="laboratorio" className="text-sm font-semibold text-gray-600">
          Laboratório
        </label>
        <input
          id="laboratorio"
          name="laboratorio"
          type="text"
          defaultValue={consultation.laboratorio || ""}
          maxLength={255}
        />
      </div>

      {/* Valor */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="valor" className="text-sm font-semibold text-gray-600">
          Valor (R$) *
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          defaultValue={formattedInputValue}
          required
          placeholder="Ex: 150,00 ou 150.50"
        />
      </div>

      {/* Observação */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="observacao" className="text-sm font-semibold text-gray-600">
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
          defaultValue={consultation.observacao || ""}
          rows={3}
        />
      </div>

      {error && (
        <div className="text-red-605 text-sm">
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
