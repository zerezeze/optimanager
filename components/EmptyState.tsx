"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-lg border border-dashed border-gray-300 shadow-xs max-w-lg mx-auto my-6 gap-5">
      <div className="p-4 bg-gray-50 text-gray-400 rounded-full">
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && actionHref && (
        <Link href={actionHref} className="btn btn-primary px-5 py-2.5 text-sm">
          {actionText}
        </Link>
      )}
    </div>
  );
}
