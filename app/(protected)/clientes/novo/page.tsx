"use client";

import { createClient } from "@/app/actions/clients";
import Link from "next/link";
import { useState, useEffect } from "react";
import PrescriptionFormFields from "@/components/PrescriptionFormFields";
import { PaymentFormFields } from "@/components/PaymentFormFields";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";

function parseBRLToCents(valStr: string): number {
  let clean = valStr.trim();
  clean = clean.replace(/\s/g, "");
  if (clean.includes(",")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed < 0 ? 0 : Math.round(parsed * 100);
}

export default function NovoClientePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [valorTotalStr, setValorTotalStr] = useState("");

  // Turn off payment registration if consultation registration is toggled off
  useEffect(() => {
    if (!showConsultation) {
      setShowPayment(false);
      setValorTotalStr("");
    }
  }, [showConsultation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createClient(formData);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Cliente cadastrado com sucesso.");
        throw err;
      }
      setError(err.message || "Não foi possível cadastrar o cliente.");
      setLoading(false);
    }
  };

  const valorTotalCentavos = parseBRLToCents(valorTotalStr);

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full flex flex-col gap-6">
      <PageHeader
        title="Novo Cliente"
        description="Preencha os dados do cliente abaixo para adicioná-lo ao sistema."
        backHref="/clientes"
        backLabel="Voltar"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        
        {/* SECTION 1: DADOS DO CLIENTE */}
        <SectionCard title="Dados do Cliente">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nome Completo *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                maxLength={255}
                placeholder="Ex: João da Silva"
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="telefone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="text"
                maxLength={20}
                placeholder="(00) 00000-0000"
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="endereco" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Endereço
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                maxLength={500}
                placeholder="Rua, Número, Bairro, Cidade"
                className="input-standard"
              />
            </div>
          </div>
        </SectionCard>

        {/* CHECKBOX CONTROL FOR CONSULTATION */}
        <div className="flex items-center gap-3 px-1">
          <input
            id="cadastrarConsultaCheckbox"
            type="checkbox"
            checked={showConsultation}
            onChange={(e) => setShowConsultation(e.target.checked)}
            className="w-4 h-4 cursor-pointer shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500/20 rounded"
          />
          <input type="hidden" name="cadastrarConsulta" value={showConsultation ? "true" : "false"} />
          <label htmlFor="cadastrarConsultaCheckbox" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
            Desejo cadastrar a primeira consulta deste cliente agora
          </label>
        </div>

        {/* SECTION 2: PRIMEIRA CONSULTA */}
        {showConsultation && (
          <div className="flex flex-col gap-6 w-full">
            <PrescriptionFormFields onValorChange={setValorTotalStr} />

            {/* CHECKBOX CONTROL FOR PAYMENT */}
            <div className="flex items-center gap-3 px-1">
              <input
                id="registerPaymentCheckbox"
                type="checkbox"
                checked={showPayment}
                onChange={(e) => setShowPayment(e.target.checked)}
                className="w-4 h-4 cursor-pointer shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500/20 rounded"
              />
              <label htmlFor="registerPaymentCheckbox" className="text-sm font-bold text-slate-650 cursor-pointer select-none">
                Adicionar Financeiro
              </label>
            </div>

            {/* SECTION 3: FINANCEIRO */}
            {showPayment && (
              <SectionCard title="Pagamento">
                <PaymentFormFields valorTotal={valorTotalCentavos} />
              </SectionCard>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm px-1 font-semibold">
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            isLoading={loading}
            className="w-full sm:flex-1 py-3 text-sm shadow-sm font-bold"
          >
            Salvar
          </Button>
          <Link href="/clientes" className="w-full sm:flex-1">
            <Button
              variant="secondary"
              className="w-full py-3 text-sm shadow-sm font-bold"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
