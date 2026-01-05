import {
  mockDashboardStats,
  mockAlertsTrend,
  mockVitalsTrend,
  systemOverviewMock,
} from '../Data/dashboard.mock';

import { apiFetch } from '../../../client';

import type { SystemOverviewData } from '../types/dashboard.types';
import type { UIAlert } from '../../Alert/types/alerts.types';

export const dashboardRepository = {
  async getStats() {
    return mockDashboardStats;
  },

  async getAlerts(limit = 5): Promise<UIAlert[]> {
    const rawAlerts = await apiFetch<any[]>('/alerts');

    const normalized: UIAlert[] = rawAlerts.map((a, index) => ({
      id: String(a.alert_id ?? index), // unique & safe
      severity:
        a.severity === 'CRITICAL' ? 'critical' : 'warning',

      alertType: a.alert_type ?? 'Unknown',
      description: a.message ?? '',
      deviceId: a.assignment_id
        ? `Assignment ${a.assignment_id}`
        : '—',

      timestamp: a.generated_at
        ? new Date(a.generated_at).toISOString()
        : new Date().toISOString(),

      acknowledged: Boolean(a.acknowledged_at),
    }));

    return normalized
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      )
      .slice(0, limit);
  },

  async getAlertsTrend() {
    return mockAlertsTrend;
  },

  async getVitalsTrend() {
    return mockVitalsTrend;
  },

  async getSystemOverview(): Promise<SystemOverviewData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(systemOverviewMock), 300);
    });
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    await apiFetch(`/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  },
};
