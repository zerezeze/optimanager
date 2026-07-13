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
      setError(err.message || "Ocorreu um erro ao registrar a consulta.");
      setLoading(false);
    }
  };

  const defaultDate = new Date().toISOString().substring(0, 10);

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="data" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Data da Consulta
        </label>
        <input
          id="data"
          name="data"
          type="date"
          defaultValue={defaultDate}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="olhoDireito" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Olho Direito
        </label>
        <input
          id="olhoDireito"
          name="olhoDireito"
          type="text"
          maxLength={50}
          placeholder="Ex: Esf -2.00 Cil -0.50 Eixo 180"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="olhoEsquerdo" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Olho Esquerdo
        </label>
        <input
          id="olhoEsquerdo"
          name="olhoEsquerdo"
          type="text"
          maxLength={50}
          placeholder="Ex: Esf -1.75 Cil -0.75 Eixo 170"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="adicao" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Adição
        </label>
        <input
          id="adicao"
          name="adicao"
          type="text"
          maxLength={50}
          placeholder="Ex: +2.00"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="lentes" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Lentes
        </label>
        <input
          id="lentes"
          name="lentes"
          type="text"
          maxLength={255}
          placeholder="Ex: Antirreflexo Crizal"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="laboratorio" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Laboratório
        </label>
        <input
          id="laboratorio"
          name="laboratorio"
          type="text"
          maxLength={255}
          placeholder="Ex: Essilor"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="valor" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Valor (R$) *
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          required
          placeholder="Ex: 150,00 ou 150.50"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="observacao" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
          rows={3}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontFamily: "Arial, sans-serif", resize: "vertical" }}
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
          {loading ? "Salvando..." : "Salvar Consulta"}
        </button>
        <Link
          href={`/clientes/${clientId}`}
          style={{ flex: 1, padding: "10px", textAlign: "center", textDecoration: "none", color: "#333", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
