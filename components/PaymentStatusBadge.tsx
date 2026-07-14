"use client";

import { PaymentStatus } from "@prisma/client";

interface PaymentStatusBadgeProps {
  status?: PaymentStatus | null;
}

const config: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAGO: {
    label: "Pago",
    className:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200",
  },
  PARCIAL: {
    label: "Parcial",
    className:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  PENDENTE: {
    label: "Pendente",
    className:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200",
  },
};

const dot: Record<PaymentStatus, string> = {
  PAGO: "🟢",
  PARCIAL: "🟡",
  PENDENTE: "🔴",
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        Sem registro
      </span>
    );
  }

  const { label, className } = config[status];
  return (
    <span className={className}>
      {dot[status]} {label}
    </span>
  );
}
