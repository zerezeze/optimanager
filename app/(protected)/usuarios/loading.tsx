import React from "react";
import { Skeleton, SkeletonHeader, SkeletonTableRow } from "@/components/Skeleton";

export default function UsuariosLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full flex flex-col gap-6">
      <SkeletonHeader />

      {/* Table skeleton */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs w-full">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <table className="w-full border-collapse">
          <tbody>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}
