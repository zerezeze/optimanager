"use client";

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
}

export default function PrescriptionFormFields({ defaultValue }: PrescriptionFormFieldsProps) {
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
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
        <label htmlFor="ordemServico" className="text-sm font-semibold text-gray-700 block mb-1">
          Ordem de Serviço (O.S.)
        </label>
        <input
          id="ordemServico"
          name="ordemServico"
          type="text"
          placeholder="Ex: OS-12345"
          defaultValue={defaultValue?.ordemServico || ""}
          className="w-full sm:max-w-xs border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Número de controle do laboratório ou da ótica.
        </p>
      </div>

      {/* CARD 1: DADOS REFRATIVOS */}
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
        <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 mb-4">
          Dados Refrativos
        </h2>
        
        {/* Tabela de Graus Responsiva */}
        <div className="flex flex-col gap-4">
          {/* Cabeçalho da tabela - Visível apenas em Desktop/Tablet */}
          <div className="hidden md:grid grid-cols-6 gap-4 items-center mb-1 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
            <div className="text-left text-gray-400">GRAU</div>
            <div>Esférico</div>
            <div>Cilíndrico</div>
            <div>Eixo</div>
            <div>DNP</div>
            <div>Altura</div>
          </div>

          {/* Linha OD (Olho Direito) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-3 md:p-0 bg-gray-50/50 md:bg-transparent rounded-lg border border-gray-100 md:border-none">
            <div className="font-bold text-sm text-gray-800 border-b border-gray-150 md:border-none pb-1 md:pb-0">
              OD (Direito)
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Esférico</label>
              <input
                name="odEsferico"
                type="text"
                placeholder="Ex: -1,50 ou PLANO"
                defaultValue={defaultValue?.odEsferico || ""}
                onBlur={handleDegreeBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Cilíndrico</label>
              <input
                name="odCilindrico"
                type="text"
                placeholder="Ex: -0,75"
                defaultValue={defaultValue?.odCilindrico || ""}
                onBlur={handleDegreeBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Eixo</label>
              <input
                name="odEixo"
                type="text"
                placeholder="0 a 180"
                defaultValue={defaultValue?.odEixo || ""}
                onChange={handleEixoChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">DNP</label>
              <input
                name="odDnp"
                type="text"
                placeholder="Ex: 32,5"
                defaultValue={defaultValue?.odDnp || ""}
                onBlur={handleDecimalBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Altura</label>
              <input
                name="odAltura"
                type="text"
                placeholder="Ex: 18,0"
                defaultValue={defaultValue?.odAltura || ""}
                onBlur={handleDecimalBlur}
              />
            </div>
          </div>

          {/* Linha OE (Olho Esquerdo) */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-3 md:p-0 bg-gray-50/50 md:bg-transparent rounded-lg border border-gray-100 md:border-none">
            <div className="font-bold text-sm text-gray-800 border-b border-gray-150 md:border-none pb-1 md:pb-0">
              OE (Esquerdo)
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Esférico</label>
              <input
                name="oeEsferico"
                type="text"
                placeholder="Ex: -1,25 ou PLANO"
                defaultValue={defaultValue?.oeEsferico || ""}
                onBlur={handleDegreeBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Cilíndrico</label>
              <input
                name="oeCilindrico"
                type="text"
                placeholder="Ex: -0,50"
                defaultValue={defaultValue?.oeCilindrico || ""}
                onBlur={handleDegreeBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Eixo</label>
              <input
                name="oeEixo"
                type="text"
                placeholder="0 a 180"
                defaultValue={defaultValue?.oeEixo || ""}
                onChange={handleEixoChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">DNP</label>
              <input
                name="oeDnp"
                type="text"
                placeholder="Ex: 31,5"
                defaultValue={defaultValue?.oeDnp || ""}
                onBlur={handleDecimalBlur}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="block md:hidden text-xs font-semibold text-gray-500">Altura</label>
              <input
                name="oeAltura"
                type="text"
                placeholder="Ex: 18,0"
                defaultValue={defaultValue?.oeAltura || ""}
                onBlur={handleDecimalBlur}
              />
            </div>
          </div>
        </div>

        {/* Adição input (bottom of refractive section) */}
        <div className="flex flex-col gap-1.5 mt-5">
          <label htmlFor="adicao" className="text-sm font-semibold text-gray-600">
            Adição
          </label>
          <input
            id="adicao"
            name="adicao"
            type="text"
            placeholder="Ex: +2,00"
            defaultValue={defaultValue?.adicao || ""}
            onBlur={handleDegreeBlur}
            className="max-w-[200px]"
          />
        </div>
      </div>

      {/* CARD 2: DADOS COMERCIAIS */}
      <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm w-full">
        <h2 className="text-lg font-bold text-blue-600 border-b border-gray-100 pb-2 mb-4">
          Dados Comerciais
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="medico" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>👨‍⚕️</span> Médico
            </label>
            <input
              id="medico"
              name="medico"
              type="text"
              placeholder="Ex: Dr. Carlos Eduardo"
              defaultValue={defaultValue?.medico || ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="data" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>📅</span> Data da Consulta
            </label>
            <input
              id="data"
              name="data"
              type="date"
              defaultValue={defaultDate}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="laboratorio" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>🏭</span> Laboratório
            </label>
            <input
              id="laboratorio"
              name="laboratorio"
              type="text"
              placeholder="Ex: Essilor"
              defaultValue={defaultValue?.laboratorio || ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lentes" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>👓</span> Lentes
            </label>
            <input
              id="lentes"
              name="lentes"
              type="text"
              placeholder="Ex: Antirreflexo Crizal"
              defaultValue={defaultValue?.lentes || ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="valor" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>💰</span> Valor (R$) *
            </label>
            <input
              id="valor"
              name="valor"
              type="text"
              required
              placeholder="Ex: 150,00"
              defaultValue={defaultValorStr}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="observacao" className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <span>📝</span> Observação
            </label>
            <textarea
              id="observacao"
              name="observacao"
              rows={3}
              placeholder="Observações clínicas ou adicionais"
              defaultValue={defaultValue?.observacao || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
