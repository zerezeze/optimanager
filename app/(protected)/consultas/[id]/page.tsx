import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultaDetalhesPage({ params }: PageProps) {
  const { id } = await params;

  // Validate UUID format to prevent database crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!consultation) {
    notFound();
  }

  const formattedDate = new Date(consultation.data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  const formattedValue = (consultation.valor / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <Link
          href={`/clientes/${consultation.clientId}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <span className="hidden sm:inline">&larr; Voltar para Perfil de {consultation.client.nome}</span>
          <span className="inline sm:hidden">&larr; Voltar ao Perfil</span>
        </Link>
        <Link
          href={`/consultas/${consultation.id}/editar`}
          className="btn btn-secondary w-full sm:w-auto"
          style={{ padding: "8px 16px", fontSize: "14px" }}
        >
          Editar Consulta
        </Link>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white p-5 sm:p-6 shadow-sm w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Ficha da Consulta</h1>
        <p className="text-sm text-gray-500 mb-6">
          Cliente: <strong className="text-gray-700">{consultation.client.nome}</strong>
        </p>

        <div className="flex flex-col gap-4">
          {/* Data e Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Data da Consulta</strong>
              <span className="text-sm text-gray-800 font-semibold">{formattedDate}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Valor</strong>
              <span className="text-sm text-gray-800 font-semibold">{formattedValue}</span>
            </div>
          </div>

          {/* Olho Direito e Olho Esquerdo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Olho Direito</strong>
              <span className="text-sm text-gray-850 font-medium break-words">{consultation.olhoDireito || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Olho Esquerdo</strong>
              <span className="text-sm text-gray-855 font-medium break-words">{consultation.olhoEsquerdo || "Não informado"}</span>
            </div>
          </div>

          {/* Adição e Lentes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Adição</strong>
              <span className="text-sm text-gray-850 font-medium break-words">{consultation.adicao || "Não informado"}</span>
            </div>
            <div>
              <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Lentes</strong>
              <span className="text-sm text-gray-850 font-medium break-words">{consultation.lentes || "Não informado"}</span>
            </div>
          </div>

          {/* Laboratório */}
          <div className="border-b border-gray-100 pb-3">
            <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Laboratório</strong>
            <span className="text-sm text-gray-850 font-medium break-words">{consultation.laboratorio || "Não informado"}</span>
          </div>

          {/* Observação */}
          <div>
            <strong className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Observação</strong>
            <span className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed block bg-gray-50 p-3 rounded border border-gray-100 mt-1">
              {consultation.observacao || "Nenhuma observação informada."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
