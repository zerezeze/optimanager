"use client";

import { createConsultation } from "@/app/actions/consultations";
import Link from "next/link";
import { useState } from "react";

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
      setError(err.message || "Ocorreu um erro ao cadastrar a consulta.");
      setLoading(false);
    }
  };

  const defaultDate = new Date().toISOString().substring(0, 10);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="data" className="text-sm font-semibold text-gray-600">
          Data da Consulta
        </label>
        <input
          id="data"
          name="data"
          type="date"
          defaultValue={defaultDate}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="olhoDireito" className="text-sm font-semibold text-gray-600">
          Olho Direito
        </label>
        <input
          id="olhoDireito"
          name="olhoDireito"
          type="text"
          maxLength={50}
          placeholder="Ex: Esf -2.00 Cil -0.50 Eixo 180"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="olhoEsquerdo" className="text-sm font-semibold text-gray-600">
          Olho Esquerdo
        </label>
        <input
          id="olhoEsquerdo"
          name="olhoEsquerdo"
          type="text"
          maxLength={50}
          placeholder="Ex: Esf -1.75 Cil -0.75 Eixo 170"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="adicao" className="text-sm font-semibold text-gray-600">
          Adição
        </label>
        <input
          id="adicao"
          name="adicao"
          type="text"
          maxLength={50}
          placeholder="Ex: +2.00"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lentes" className="text-sm font-semibold text-gray-600">
          Lentes
        </label>
        <input
          id="lentes"
          name="lentes"
          type="text"
          maxLength={255}
          placeholder="Ex: Antirreflexo Crizal"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="laboratorio" className="text-sm font-semibold text-gray-600">
          Laboratório
        </label>
        <input
          id="laboratorio"
          name="laboratorio"
          type="text"
          maxLength={255}
          placeholder="Ex: Essilor"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="valor" className="text-sm font-semibold text-gray-600">
          Valor (R$) *
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          required
          placeholder="Ex: 150,00 ou 150.50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="observacao" className="text-sm font-semibold text-gray-600">
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
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
