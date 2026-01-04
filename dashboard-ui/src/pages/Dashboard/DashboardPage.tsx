import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hook/useDashboardData';
import { SystemOverview } from './components/SystemOverview';
import { AggregatedMetrics } from './components/AggregatedMetrics/AggregatedMetrics';
import { SystemAlertsPanel } from './components/SystemAlertsPanel';

export default function DashboardPage() {
  // ✅ Hook اینجا، داخل کامپوننت
  const navigate = useNavigate();

  const {
    systemOverview,
    metrics,
    alerts,
    acknowledgeAlert,
  } = useDashboardData();

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
      />
    </div>
  );
}
