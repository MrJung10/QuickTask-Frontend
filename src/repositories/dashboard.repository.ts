import { apiClient } from "@/lib/api/config";
import { DashboardApiResponse } from "@/types/dashboard.types";

export const dashboardRepository = {
  async getDashboardOverview(): Promise<DashboardApiResponse> {
    try {
      const response = await apiClient.get<DashboardApiResponse>('/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },
};