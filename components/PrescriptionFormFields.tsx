"use client";

import { SectionCard } from "@/components/ui/SectionCard";

interface PrescriptionData {
  odEsferico?: string | null;
  odCilindrico?: string | null;
  odEixo?: string | null;
  odDnp?: string | null;
  odAltura?: string | null;
  oeEsferico?: string | null;
  oeCilindrico?: string | null;
  oeEixo?: string | null;
  oeDnp?: string | null;
  oeAltura?: string | null;
  adicao?: string | null;
  lentes?: string | null;
  laboratorio?: string | null;
  medico?: string | null;
  valor?: number | null;
  data?: Date | string | null;
  observacao?: string | null;
  ordemServico?: string | null;
}

interface PrescriptionFormFieldsProps {
  defaultValue?: PrescriptionData | null;
  onValorChange?: (val: string) => void;
}

export default function PrescriptionFormFields({ defaultValue, onValorChange }: PrescriptionFormFieldsProps) {
  const defaultDate = defaultValue?.data
    ? new Date(defaultValue.data).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10);

  const defaultValorStr = defaultValue?.valor
    ? (defaultValue.valor / 100).toFixed(2).replace(".", ",")
    : "";

  // Helper formats on Blur
  const handleDegreeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toUpperCase();
    if (val === "") return;
    if (val === "PLANO" || val === "PLAN" || val === "P") {
      e.target.value = "PLANO";
      return;
    }
    const isCilindrico = e.target.name === "odCilindrico" || e.target.name === "oeCilindrico";
    const normalized = val.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      if (isCilindrico) {
        // Cilíndrico é sempre negativo
        const absVal = Math.abs(parsed);
        e.target.value = `-${absVal.toFixed(2).replace(".", ",")}`;
      } else {
        // Esférico e Adição podem ser positivos ou negativos
        const isNegative = parsed < 0 || Object.is(parsed, -0);
        const sign = isNegative ? "" : "+";
        e.target.value = `${sign}${parsed.toFixed(2).replace(".", ",")}`;
      }
    }
  };

  const handleEixoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // numbers only
    if (val !== "") {
      const parsed = parseInt(val, 10);
      if (parsed > 180) {
        val = "180";
      }
    }
    e.target.value = val;
  };

  const handleDecimalBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val === "") return;
    const normalized = val.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      e.target.value = parsed.toFixed(2).replace(".", ",");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ORDEM DE SERVIÇO */}
      <SectionCard title="Ordem de Serviço (O.S.)">
        <div className="flex flex-col gap-1.5">
          <input
            id="ordemServico"
            name="ordemServico"
            type="text"
            placeholder="Ex: OS-12345"
            defaultValue={defaultValue?.ordemServico || ""}
            className="w-full sm:max-w-xs input-standard"
          />
          <p className="text-[11px] text-slate-400 font-medium">
            Número de controle do laboratório ou da ótica.
          </p>
        </div>
      </SectionCard>

      {/* CARD 1: DADOS REFRATIVOS */}
      <SectionCard title="Dados Refrativos">
        {/* Tabela de Graus Responsiva */}
        <div className="flex flex-col gap-4">
          {/* Cabeçalho da tabela - Visível apenas em Desktop/Tablet */}
          <div className="hidden md:grid grid-cols-6 gap-4 items-center mb-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
            <div className="text-left">Olho</div>
            <div>Esférico</div>
            <div>Cilíndrico</div>
            <div>Eixo</div>
            <div>DNP</div>
            <div>Altura</div>
          </div>

          {/* Linha OD (Olho Direito) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-3.5 md:p-0 bg-slate-50/50 md:bg-transparent rounded-xl border border-slate-100 md:border-none">
            <div className="font-bold text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 md:border-none pb-1.5 md:pb-0">
              OD (Direito)
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Esférico</label>
              <input
                name="odEsferico"
                type="text"
                placeholder="Ex: -1,50 ou PLANO"
                defaultValue={defaultValue?.odEsferico || ""}
                onBlur={handleDegreeBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cilíndrico</label>
              <input
                name="odCilindrico"
                type="text"
                placeholder="Ex: -0,75"
                defaultValue={defaultValue?.odCilindrico || ""}
                onBlur={handleDegreeBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eixo</label>
              <input
                name="odEixo"
                type="text"
                placeholder="0 a 180"
                defaultValue={defaultValue?.odEixo || ""}
                onChange={handleEixoChange}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">DNP</label>
              <input
                name="odDnp"
                type="text"
                placeholder="Ex: 32,5"
                defaultValue={defaultValue?.odDnp || ""}
                onBlur={handleDecimalBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Altura</label>
              <input
                name="odAltura"
                type="text"
                placeholder="Ex: 18,0"
                defaultValue={defaultValue?.odAltura || ""}
                onBlur={handleDecimalBlur}
                className="input-standard"
              />
            </div>
          </div>

          {/* Linha OE (Olho Esquerdo) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-3.5 md:p-0 bg-slate-50/50 md:bg-transparent rounded-xl border border-slate-100 md:border-none">
            <div className="font-bold text-xs text-slate-700 uppercase tracking-wider border-b border-slate-100 md:border-none pb-1.5 md:pb-0">
              OE (Esquerdo)
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Esférico</label>
              <input
                name="oeEsferico"
                type="text"
                placeholder="Ex: -1,25 ou PLANO"
                defaultValue={defaultValue?.oeEsferico || ""}
                onBlur={handleDegreeBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cilíndrico</label>
              <input
                name="oeCilindrico"
                type="text"
                placeholder="Ex: -0,50"
                defaultValue={defaultValue?.oeCilindrico || ""}
                onBlur={handleDegreeBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eixo</label>
              <input
                name="oeEixo"
                type="text"
                placeholder="0 a 180"
                defaultValue={defaultValue?.oeEixo || ""}
                onChange={handleEixoChange}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">DNP</label>
              <input
                name="oeDnp"
                type="text"
                placeholder="Ex: 31,5"
                defaultValue={defaultValue?.oeDnp || ""}
                onBlur={handleDecimalBlur}
                className="input-standard"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider">Altura</label>
              <input
                name="oeAltura"
                type="text"
                placeholder="Ex: 18,0"
                defaultValue={defaultValue?.oeAltura || ""}
                onBlur={handleDecimalBlur}
                className="input-standard"
              />
            </div>
          </div>
        </div>

        {/* Adição input (bottom of refractive section) */}
        <div className="flex flex-col gap-1.5 mt-5">
          <label htmlFor="adicao" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Adição
          </label>
          <input
            id="adicao"
            name="adicao"
            type="text"
            placeholder="Ex: +2,00"
            defaultValue={defaultValue?.adicao || ""}
            onBlur={handleDegreeBlur}
            className="max-w-[200px] input-standard"
          />
        </div>
      </SectionCard>

      {/* CARD 2: DADOS COMERCIAIS */}
      <SectionCard title="Dados Comerciais">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="medico" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Médico
            </label>
            <input
              id="medico"
              name="medico"
              type="text"
              placeholder="Ex: Dr. Carlos Eduardo"
              defaultValue={defaultValue?.medico || ""}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="data" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data da Consulta
            </label>
            <input
              id="data"
              name="data"
              type="date"
              defaultValue={defaultDate}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="laboratorio" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Laboratório
            </label>
            <input
              id="laboratorio"
              name="laboratorio"
              type="text"
              placeholder="Ex: Essilor"
              defaultValue={defaultValue?.laboratorio || ""}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lentes" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lentes
            </label>
            <input
              id="lentes"
              name="lentes"
              type="text"
              placeholder="Ex: Antirreflexo Crizal"
              defaultValue={defaultValue?.lentes || ""}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="valor" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Valor (R$) *
            </label>
            <input
              id="valor"
              name="valor"
              type="text"
              required
              placeholder="Ex: 150,00"
              defaultValue={defaultValorStr}
              onChange={(e) => onValorChange?.(e.target.value)}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="observacao" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Observação
            </label>
            <textarea
              id="observacao"
              name="observacao"
              rows={3}
              placeholder="Observações clínicas ou adicionais"
              defaultValue={defaultValue?.observacao || ""}
              className="input-standard"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
