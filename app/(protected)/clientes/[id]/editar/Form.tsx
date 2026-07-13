"use client";

import { updateClient } from "@/app/actions/clients";
import Link from "next/link";
import { useState } from "react";

interface ClientData {
  id: string;
  nome: string;
  endereco: string | null;
  telefone: string | null;
}

interface EditarFormProps {
  client: ClientData;
}

export default function EditarForm({ client }: EditarFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await updateClient(client.id, formData);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar o cliente.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nome" className="text-sm font-semibold text-gray-600">
          Nome Completo *
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          defaultValue={client.nome}
          required
          maxLength={255}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefone" className="text-sm font-semibold text-gray-600">
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="text"
          defaultValue={client.telefone || ""}
          maxLength={20}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="endereco" className="text-sm font-semibold text-gray-600">
          Endereço
        </label>
        <input
          id="endereco"
          name="endereco"
          type="text"
          defaultValue={client.endereco || ""}
          maxLength={500}
          placeholder="Rua, Número, Bairro, Cidade"
        />
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
          href={`/clientes/${client.id}`}
          className="btn btn-secondary w-full sm:flex-1 py-3 text-center"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
