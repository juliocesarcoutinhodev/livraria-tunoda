/**
 * Dashboard Service - Serviço de métricas do dashboard
 *
 * @module services/dashboardService
 */

import { apiClient } from "@/lib/api-client";
import type { DashboardMetrics } from "@/types/dashboard";

const getMetrics = async (days: number, topLimit: number): Promise<DashboardMetrics> => {
  const response = await apiClient.get<DashboardMetrics>(
    "/admin/dashboard/metrics",
    {
      params: { days, topLimit },
    }
  );
  return response.data;
};

export const dashboardService = {
  getMetrics,
};
