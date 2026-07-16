import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs w-full flex flex-col gap-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-16" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="hover:bg-gray-50/50">
      <td className="p-4 px-4"><Skeleton className="h-5 w-32" /></td>
      <td className="p-4 px-4"><Skeleton className="h-5 w-24" /></td>
      <td className="p-4 px-4"><Skeleton className="h-5 w-40" /></td>
      <td className="p-4 px-4 text-right"><Skeleton className="h-5 w-16 ml-auto" /></td>
    </tr>
  );
}

export function SkeletonListCard() {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 sm:w-64" />
        <Skeleton className="h-4 w-32 sm:w-48" />
      </div>
      <Skeleton className="h-10 w-full sm:w-36" />
    </div>
  );
}
