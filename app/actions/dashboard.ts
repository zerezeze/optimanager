"use server";

import { requireAuthenticated } from "@/lib/authz";
import { fetchDashboardData, DashboardFilters, DashboardMetrics } from "@/lib/dashboard";

export async function getDashboardData(filters: DashboardFilters): Promise<DashboardMetrics> {
  const sessionUser = await requireAuthenticated();
  return await fetchDashboardData(sessionUser, filters);
}
