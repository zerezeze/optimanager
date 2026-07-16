"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  isPending = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay z-50" />
        <Dialog.Content className="dialog-content z-50">
          <div className="flex gap-4">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-full h-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 leading-relaxed mt-1">
                {description}
              </Dialog.Description>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-150">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isPending}
                className="btn btn-secondary px-4 py-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="btn bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-md border-none px-4 py-2 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[80px]"
            >
              {isPending ? "Excluindo..." : confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
