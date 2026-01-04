import { useEffect, useMemo, useState } from 'react';
import { UIAlert } from '../types/alerts.types';
import { alertsRepository } from '../repositories/alerts.repository';

export function useAlerts() {
  const [alerts, setAlerts] = useState<UIAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [severity, setSeverity] =
    useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [status, setStatus] =
    useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // 🔹 initial load
  useEffect(() => {
    alertsRepository.getAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  // 🔹 filters
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.deviceId.toLowerCase().includes(search.toLowerCase());

      const matchSeverity = severity === 'all' || a.severity === severity;
      const matchStatus = status === 'all' || a.status === status;

      return matchSearch && matchSeverity && matchStatus;
    });
  }, [alerts, search, severity, status]);

  // 🔹 selected alert
  const selectedAlert = useMemo(() => {
    return alerts.find((a) => a.id === selectedAlertId) ?? null;
  }, [alerts, selectedAlertId]);

  // 🔹 acknowledge logic
  const acknowledgeAlert = async (id: string) => {
    // optimistic update
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'acknowledged' } : a
      )
    );

    try {
      await alertsRepository.acknowledgeAlert(id);
    } catch (e) {
      // rollback if API fails
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'new' } : a
        )
      );
    }
  };

  // 🔹 stats
  const stats = useMemo(
    () => ({
      total: alerts.length,
      active: alerts.filter((a) => a.status !== 'resolved').length,
      critical: alerts.filter(
        (a) => a.severity === 'critical' && a.status !== 'resolved'
      ).length,
      warnings: alerts.filter(
        (a) => a.severity === 'warning' && a.status !== 'resolved'
      ).length,
    }),
    [alerts]
  );

  return {
    loading,

    search,
    setSearch,
    severity,
    setSeverity,
    status,
    setStatus,

    filteredAlerts,
    stats,

    selectedAlert,
    setSelectedAlert: (alert: UIAlert | null) =>
      setSelectedAlertId(alert ? alert.id : null),

    acknowledgeAlert,
  };
}
