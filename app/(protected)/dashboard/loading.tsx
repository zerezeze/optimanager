import React from "react";
import { Skeleton, SkeletonMetricCard, SkeletonHeader } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto font-sans w-full flex flex-col gap-6">
      <SkeletonHeader />

      {/* Metrics Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>

      {/* Shortcut Buttons Skeletons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 flex-1" />
      </div>

      {/* Grid boxes skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Recent clients */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-10/12" />
            <Skeleton className="h-5 w-9/12" />
          </div>
        </div>

        {/* Recent consultations */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-10/12" />
            <Skeleton className="h-5 w-9/12" />
          </div>
        </div>
      </div>
    </div>
  );
}
