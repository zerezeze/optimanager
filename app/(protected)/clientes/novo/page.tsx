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
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        
        {/* SECTION 1: DADOS DO CLIENTE */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
          <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 mb-4">
            Dados do Cliente
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className="text-sm font-semibold text-gray-600">
                Nome Completo *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                maxLength={255}
                placeholder="Ex: João da Silva"
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
                maxLength={500}
                placeholder="Rua, Número, Bairro, Cidade"
              />
            </div>
          </div>
        </div>

        {/* CHECKBOX CONTROL */}
        <div className="flex items-center gap-3 px-1">
          <input
            id="cadastrarConsultaCheckbox"
            type="checkbox"
            checked={showConsultation}
            onChange={(e) => setShowConsultation(e.target.checked)}
            className="w-5 h-5 cursor-pointer shrink-0"
          />
          <input type="hidden" name="cadastrarConsulta" value={showConsultation ? "true" : "false"} />
          <label htmlFor="cadastrarConsultaCheckbox" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
            Desejo cadastrar a primeira consulta deste cliente agora
          </label>
        </div>

        {/* SECTION 2: PRIMEIRA CONSULTA */}
        {showConsultation && (
          <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
            <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 mb-4">
              Primeira Consulta
            </h2>
            <div className="flex flex-col gap-4">
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
                  required={showConsultation}
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
                  placeholder="Observações clínicas ou adicionais"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm px-1">
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full sm:flex-1 py-3"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <Link
            href="/clientes"
            className="btn btn-secondary w-full sm:flex-1 py-3 text-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
