import { useEffect, useState } from 'react';
import { dashboardRepository } from '../repositories/dashboard.repository';
import type {
  DashboardStats,
  SystemAlert,
  SystemOverviewData,
} from '../types/dashboard.types';

export function useDashboardData() {
  const [systemOverview, setSystemOverview] =
    useState<SystemOverviewData | null>(null);

  const [metrics, setMetrics] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [alertsTrendData, setAlertsTrendData] =
    useState<{ time: string; alerts: number }[]>([]);
  const [vitalsTrendData, setVitalsTrendData] =
    useState<{ time: string; avgHeartRate: number; avgSpo2: number }[]>([]);

  /* ============ Load from repository ONLY ============ */
  useEffect(() => {
    async function load() {
      const [
        stats,
        alerts,
        alertsTrend,
        vitalsTrend,
        overview,
      ] = await Promise.all([
        dashboardRepository.getStats(),
        dashboardRepository.getAlerts(),
        dashboardRepository.getAlertsTrend(),
        dashboardRepository.getVitalsTrend(),
        dashboardRepository.getSystemOverview(),
      ]);

      setMetrics(stats);
      setAlerts(alerts);
      setAlertsTrendData(alertsTrend);
      setVitalsTrendData(vitalsTrend);
      setSystemOverview(overview);
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
  };
}
