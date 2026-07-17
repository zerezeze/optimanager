"use client";

import { PaymentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

interface PaymentStatusBadgeProps {
  status?: PaymentStatus | null;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  if (!status) {
    return <Badge variant="neutral">Sem Registro</Badge>;
  }

  const badgeVariants: Record<PaymentStatus, "success" | "warning" | "danger"> = {
    PAGO: "success",
    PARCIAL: "warning",
    PENDENTE: "danger",
  };

  const labels: Record<PaymentStatus, string> = {
    PAGO: "Pago",
    PARCIAL: "Parcial",
    PENDENTE: "Pendente",
  };

  return (
    <Badge variant={badgeVariants[status]}>
      {labels[status]}
    </Badge>
  );
}
