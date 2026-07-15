import { apiRequest } from "@/services/api";
import type { DashboardMetrics } from "@/types/dashboard";

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    return apiRequest<DashboardMetrics>(
      "/dashboard/metrics",
      { method: "GET", authenticated: true },
    );
  },
};
