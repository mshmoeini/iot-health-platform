import {
  mockDashboardStats,
  mockDashboardAlerts,
  mockAlertsTrend,
  mockVitalsTrend,
  systemOverviewMock
} from '../Data/ dashboard.mock';
import type { SystemOverviewData } from '../types/dashboard.types';

export const dashboardRepository = {
  async getStats() {
    return mockDashboardStats;
  },

  async getAlerts() {
    return mockDashboardAlerts;
  },

  async getAlertsTrend() {
    return mockAlertsTrend;
  },

  async getVitalsTrend() {
    return mockVitalsTrend;
  },
  
 async getSystemOverview(): Promise<SystemOverviewData> {
    // 🔜 later replace with real API
    // const res = await fetch('/api/dashboard/overview');
    // return res.json();

    return new Promise((resolve) => {
      setTimeout(() => resolve(systemOverviewMock), 300);
    });
  },
  async acknowledgeAlert(alertId: string): Promise<void> {
  // API واقعی
  await fetch(`/api/alerts/${alertId}/acknowledge`, {
    method: 'POST',
  });
}
};
