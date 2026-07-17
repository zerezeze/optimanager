import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "default" | "danger" | "success";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = "default",
  className = "",
}: StatCardProps) {
  const borderClass =
    variant === "danger"
      ? "border-l-4 border-l-red-500"
      : variant === "success"
      ? "border-l-4 border-l-green-500"
      : "";

  return (
    <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col justify-between ${borderClass} ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <span className="p-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg">
          {icon}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {(description || trend) && (
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            {trend && (
              <span className={trend.isPositive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {trend.value}
              </span>
            )}
            {description && <span className="text-slate-400 font-medium">{description}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
