"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Printer, FileText } from "lucide-react";
import { PrescriptionPdfData } from "@/components/PrescriptionPdfDocument";

interface PrintActionsProps {
  data: PrescriptionPdfData;
}

export function PrintActions({ data }: PrintActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Client-Side CSS print for Lab Sheet (clinical focus)
  const handlePrintLab = () => {
    try {
      document.body.classList.add("print-lab-only");
      window.print();
    } finally {
      document.body.classList.remove("print-lab-only");
    }
  };

  // 2. Client-Side CSS print for Receipt (commercial focus)
  const handlePrintReceipt = () => {
    try {
      document.body.classList.add("print-receipt-only");
      window.print();
    } finally {
      document.body.classList.remove("print-receipt-only");
    }
  };

  // 3. Client-Side dynamically generated PDF via react-pdf
  const handleGeneratePdf = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Dynamic import to prevent SSR/Node build crashes & optimize bundle sizes
      const { pdf } = await import("@react-pdf/renderer");
      const { PrescriptionPdfDocument } = await import("@/components/PrescriptionPdfDocument");

      // Generate the PDF stream/blob asynchronously
      const doc = <PrescriptionPdfDocument data={data} />;
      const blob = await pdf(doc).toBlob();

      // Create download url
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Sanitize client name for filename
      const cleanName = data.clientNome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove invalid characters
        .trim()
        .replace(/\s+/g, "_"); // Replace spaces with underscores

      link.download = `Receita_${cleanName}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("PDF da receita gerado com sucesso!");
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error("Ocorreu um erro ao gerar o PDF da receita. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 w-full no-print">
      <button
        onClick={handlePrintReceipt}
        className="btn btn-secondary flex items-center justify-center gap-1.5 py-2.5 px-4 text-sm font-semibold rounded-md border border-gray-200 cursor-pointer bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 w-full sm:w-auto"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimir Recibo</span>
      </button>

      <button
        onClick={handlePrintLab}
        className="btn btn-secondary flex items-center justify-center gap-1.5 py-2.5 px-4 text-sm font-semibold rounded-md border border-gray-200 cursor-pointer bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 w-full sm:w-auto"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimir Ficha de Laboratório</span>
      </button>

      <button
        onClick={handleGeneratePdf}
        disabled={isGenerating}
        className="btn bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center gap-1.5 py-2.5 px-4 text-sm font-semibold rounded-md border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
      >
        <FileText className="w-4 h-4" />
        <span>{isGenerating ? "Gerando PDF..." : "Gerar PDF da Receita"}</span>
      </button>
    </div>
  );
}
