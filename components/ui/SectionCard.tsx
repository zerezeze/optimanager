import React from "react";

interface SectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, action, children, className = "" }: SectionCardProps) {
  return (
    <div className={`p-5 border border-slate-150 rounded-xl bg-white shadow-sm w-full flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
