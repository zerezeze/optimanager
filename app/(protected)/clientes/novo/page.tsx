"use client";

import { createClient } from "@/app/actions/clients";
import Link from "next/link";
import { useState } from "react";

export default function NovoClientePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createClient(formData);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao cadastrar o cliente.");
      setLoading(false);
    }
  };

  const defaultDate = new Date().toISOString().substring(0, 10);

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>Novo Cliente</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* SECTION 1: DADOS DO CLIENTE */}
        <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0", color: "#0070f3", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
            Dados do Cliente
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="nome" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
                Nome Completo *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                maxLength={255}
                placeholder="Ex: João da Silva"
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                maxLength={20}
                placeholder="(00) 00000-0000"
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                maxLength={500}
                placeholder="Rua, Número, Bairro, Cidade"
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        {/* CHECKBOX CONTROL */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 8px" }}>
          <input
            id="cadastrarConsultaCheckbox"
            type="checkbox"
            checked={showConsultation}
            onChange={(e) => setShowConsultation(e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <input type="hidden" name="cadastrarConsulta" value={showConsultation ? "true" : "false"} />
          <label htmlFor="cadastrarConsultaCheckbox" style={{ fontSize: "14px", fontWeight: "600", color: "#333", cursor: "pointer" }}>
            Desejo cadastrar a primeira consulta deste cliente agora
          </label>
        </div>

        {/* SECTION 2: PRIMEIRA CONSULTA */}
        {showConsultation && (
          <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "6px", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 16px 0", color: "#0070f3", borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
              Primeira Consulta
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="data" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
                  Data da Consulta
                </label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  defaultValue={defaultDate}
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  required={showConsultation}
                  placeholder="Ex: 150,00 ou 150.50"
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
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
                  placeholder="Observações clínicas ou adicionais"
                  style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontFamily: "Arial, sans-serif", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#d32f2f", fontSize: "14px", padding: "0 8px" }}>
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "12px", padding: "0 8px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, padding: "12px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <Link
            href="/clientes"
            style={{ flex: 1, padding: "12px", textAlign: "center", textDecoration: "none", color: "#333", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
