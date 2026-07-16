"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleDelete = () => {
    setIsOpen(false);
    startTransition(async () => {
      try {
        const result = await deleteConsultation(consultationId);
        if (result?.success) {
          toast.success("Consulta excluída com sucesso.");
          router.push(`/clientes/${result.clientId}`);
        }
      } catch (error: any) {
        toast.error(error.message || "Não foi possível excluir a consulta.");
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
