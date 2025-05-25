import { dashboardRepository } from '@/repositories/dashboard.repository';
import { DashboardData } from '@/types/dashboard.types';
import { create } from 'zustand';

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardRepository.getDashboardOverview();
      if (response.success) {
        set({ dashboardData: response.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ error: 'Failed to load dashboard data', isLoading: false });
    }
  },
}));