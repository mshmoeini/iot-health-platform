import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hook/useDashboardData';
import { SystemOverview } from './components/SystemOverview';
import { AggregatedMetrics } from './components/AggregatedMetrics/AggregatedMetrics';
import { SystemAlertsPanel } from './components/SystemAlertsPanel';

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    systemOverview,
    metrics,
    alerts,
    acknowledgeAlert,
    loading,
    error,
  } = useDashboardData();

  // ⏳ Loading state
  if (loading) {
    return <div className="text-sm text-gray-500">Loading dashboard…</div>;
  }

  // ❌ Error state
  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  // 🛡 Safety (should rarely happen now)
  if (!systemOverview) return null;

  return (
    <div className="space-y-6">
      <SystemOverview
        activeDevices={systemOverview.activeDevices}
        patientsMonitored={systemOverview.patientsMonitored}
        activeAlerts={systemOverview.activeAlerts}
        lastUpdate={systemOverview.lastUpdate}
      />

      {metrics && <AggregatedMetrics metrics={metrics} />}

      <SystemAlertsPanel
        alerts={alerts}
        onViewDetails={(id) => navigate(`/alerts?id=${id}`)}
        onAcknowledge={acknowledgeAlert}   
      />
    </div>
  );
}
