"use client";

import { useState, useTransition } from "react";
import { deleteConsultation } from "@/app/actions/consultations";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Trash2 } from "lucide-react";

interface DeleteConsultationButtonProps {
  consultationId: string;
}

export function DeleteConsultationButton({ consultationId }: DeleteConsultationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteConsultation(consultationId);
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
          toast.success("Consulta excluída com sucesso.");
          setIsOpen(false);
          throw error; // Rethrow so Next.js redirects
        }
        toast.error(error.message || "Não foi possível excluir a consulta.");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="btn btn-danger w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md border-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        style={{ padding: "8px 16px", fontSize: "14px" }}
      >
        <Trash2 className="w-4 h-4" />
        {isPending ? "Excluindo..." : "Excluir Consulta"}
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Excluir Consulta"
        description="Tem certeza que deseja excluir esta consulta? Essa ação não poderá ser desfeita e removerá todo o histórico clínico desta ficha."
        onConfirm={handleDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        isPending={isPending}
      />
    </>
  );
}
