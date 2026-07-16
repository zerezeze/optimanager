import React from "react";
import { Skeleton, SkeletonHeader } from "@/components/Skeleton";

export default function ConsultaDetalhesLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto font-sans w-full flex flex-col gap-6">
      {/* Navigation Header Skeleton */}
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {/* Title skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Card 0 O.S. skeleton */}
        <div className="p-4 border border-gray-200 rounded-lg bg-white flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-36" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Card 1 Refractive metrics skeleton */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs w-full flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-36 w-full" />
        </div>

        {/* Card 2 Commercial info skeleton */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-xs w-full flex flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
