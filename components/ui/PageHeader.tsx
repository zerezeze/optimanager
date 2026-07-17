import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 mb-6 no-print ${className}`}>
      {backHref && (
        <Link
          href={backHref}
          className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors w-fit"
        >
          &larr; {backLabel || "Voltar"}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">{children}</div>}
      </div>
    </div>
  );
}
