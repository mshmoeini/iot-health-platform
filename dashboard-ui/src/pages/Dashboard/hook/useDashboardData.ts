import { useEffect, useState } from 'react';
import { dashboardRepository } from '../repositories/dashboard.repository';

import type {
  DashboardStats,
  SystemOverviewData,
} from '../types/dashboard.types';

import type { UIAlert } from '../../Alert/types/alerts.types';

export function useDashboardData() {
  const [systemOverview, setSystemOverview] =
    useState<SystemOverviewData | null>(null);

  const [metrics, setMetrics] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<UIAlert[]>([]);
  const [alertsTrendData, setAlertsTrendData] =
    useState<{ time: string; alerts: number }[]>([]);
  const [vitalsTrendData, setVitalsTrendData] =
    useState<{ time: string; avgHeartRate: number; avgSpo2: number }[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ============ Load from repository ONLY ============ */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [
          stats,
          recentAlerts,
          alertsTrend,
          vitalsTrend,
          overview,
        ] = await Promise.all([
          dashboardRepository.getStats(),
          dashboardRepository.getAlerts(5), // 👈 فقط ۵ تای آخر
          dashboardRepository.getAlertsTrend(),
          dashboardRepository.getVitalsTrend(),
          dashboardRepository.getSystemOverview(),
        ]);

        setMetrics(stats);
        setAlerts(recentAlerts);
        setAlertsTrendData(alertsTrend);
        setVitalsTrendData(vitalsTrend);
        setSystemOverview(overview);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ============ Acknowledge alert (UI + Backend) ============ */
  const acknowledgeAlert = async (id: string) => {
    // 1️⃣ optimistic UI update
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      )
    );

    try {
      // 2️⃣ inform backend
      await dashboardRepository.acknowledgeAlert(id);
    } catch (error) {
      // 3️⃣ rollback if failed
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, acknowledged: false } : a
        )
      );
    }
  };

  return {
    lastUpdate: systemOverview?.lastUpdate ?? '',
    metrics,
    alerts,
    systemOverview,
    alertsTrendData,
    vitalsTrendData,
    acknowledgeAlert,
    loading,
    error,
  };
}
