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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="nome" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="telefone" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="endereco" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
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
        <div style={{ color: "#d32f2f", fontSize: "13px", margin: "4px 0" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ flex: 1, padding: "10px" }}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <Link
          href="/clientes"
          className="btn btn-secondary"
          style={{ flex: 1, padding: "10px" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
