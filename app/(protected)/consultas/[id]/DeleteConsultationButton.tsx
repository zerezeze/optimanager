"use client";

import { useTransition } from "react";
import { deleteConsultation } from "@/app/actions/consultations";

interface DeleteConsultationButtonProps {
  consultationId: string;
}

export function DeleteConsultationButton({ consultationId }: DeleteConsultationButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.")) {
      startTransition(async () => {
        try {
          await deleteConsultation(consultationId);
        } catch (error: any) {
          alert(error.message || "Erro ao excluir consulta.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-danger w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md border-none"
      style={{ padding: "8px 16px", fontSize: "14px" }}
    >
      {isPending ? "Excluindo..." : "Excluir Consulta"}
    </button>
  );
}
