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
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
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
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
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
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
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
          style={{ flex: 1, padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <Link
          href="/clientes"
          style={{ flex: 1, padding: "10px", textAlign: "center", textDecoration: "none", color: "#333", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
