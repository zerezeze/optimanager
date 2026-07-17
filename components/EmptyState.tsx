import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto my-6 gap-5">
      <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button className="text-xs py-2 px-4 shadow-sm">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
}
