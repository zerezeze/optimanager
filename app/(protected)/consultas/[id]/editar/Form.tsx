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
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Date */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="data" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Data da Consulta
        </label>
        <input
          id="data"
          name="data"
          type="date"
          defaultValue={formattedInputDate}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Olho Direito */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="olhoDireito" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Olho Direito
        </label>
        <input
          id="olhoDireito"
          name="olhoDireito"
          type="text"
          defaultValue={consultation.olhoDireito || ""}
          maxLength={50}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Olho Esquerdo */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="olhoEsquerdo" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Olho Esquerdo
        </label>
        <input
          id="olhoEsquerdo"
          name="olhoEsquerdo"
          type="text"
          defaultValue={consultation.olhoEsquerdo || ""}
          maxLength={50}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Adição */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="adicao" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Adição
        </label>
        <input
          id="adicao"
          name="adicao"
          type="text"
          defaultValue={consultation.adicao || ""}
          maxLength={50}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Lentes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="lentes" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Lentes
        </label>
        <input
          id="lentes"
          name="lentes"
          type="text"
          defaultValue={consultation.lentes || ""}
          maxLength={255}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Laboratório */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="laboratorio" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Laboratório
        </label>
        <input
          id="laboratorio"
          name="laboratorio"
          type="text"
          defaultValue={consultation.laboratorio || ""}
          maxLength={255}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Valor */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="valor" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Valor (R$) *
        </label>
        <input
          id="valor"
          name="valor"
          type="text"
          defaultValue={formattedInputValue}
          required
          placeholder="Ex: 150,00 ou 150.50"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
      </div>

      {/* Observação */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="observacao" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
          defaultValue={consultation.observacao || ""}
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
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <Link
          href={`/consultas/${consultation.id}`}
          style={{ flex: 1, padding: "10px", textAlign: "center", textDecoration: "none", color: "#333", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
