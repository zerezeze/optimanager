"use client";

import { deleteClient } from "@/app/actions/clients";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { Trash2 } from "lucide-react";

interface DeleteClientButtonProps {
  clientId: string;
}

export default function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteClient(clientId);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
          toast.success("Cliente excluído com sucesso.");
          setIsOpen(false);
          throw err; // Rethrow so Next.js redirects
        }
        toast.error(err.message || "Não foi possível excluir o cliente.");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="btn btn-danger flex items-center gap-2 cursor-pointer disabled:opacity-50"
        style={{ padding: "8px 16px", fontSize: "14px" }}
      >
        <Trash2 className="w-4 h-4" />
        {isPending ? "Excluindo..." : "Excluir Cliente"}
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Excluir Cliente"
        description="Tem certeza que deseja excluir este cliente? Essa ação não poderá ser desfeita e removerá o cadastro permanentemente."
        onConfirm={handleDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        isPending={isPending}
      />
    </>
  );
}
