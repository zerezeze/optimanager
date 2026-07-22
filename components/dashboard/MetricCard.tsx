import React from "react";
import { StatCard } from "@/components/ui/StatCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "danger" | "success";
}

export function MetricCard(props: MetricCardProps) {
  return <StatCard {...props} className="h-full" />;
}
