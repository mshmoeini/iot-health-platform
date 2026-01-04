import { useAlerts } from './hook/useAlerts';
import { AlertsStats } from './components/AlertsStats';
import { AlertsFilterBar } from './components/AlertsFilterBar';
import { AlertsList } from './components/AlertsList';
import { AlertDetailsPanel } from './components/AlertDetailsPanel';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function AlertsPage() {
  const alerts = useAlerts(); // ✅ اول hook
  const [searchParams] = useSearchParams();
  const alertIdFromUrl = searchParams.get('id');

  // 🔍 debug: selected alert changes
  useEffect(() => {
    console.log('SELECTED ALERT ID:', alerts.selectedAlert?.id);
    console.log('SELECTED ALERT OBJ:', alerts.selectedAlert);
  }, [alerts.selectedAlert]);

  // 🔗 auto-select from URL
  useEffect(() => {
    if (!alertIdFromUrl) return;
    if (!alerts.filteredAlerts.length) return;

    const alertToSelect = alerts.filteredAlerts.find(
      (a) => a.id === alertIdFromUrl
    );

    if (alertToSelect) {
      alerts.setSelectedAlert(alertToSelect);
    }
  }, [alertIdFromUrl, alerts.filteredAlerts]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl text-gray-900">Alerts</h2>
        <p className="text-gray-600">
          System-wide notifications from Risk Analysis Service
        </p>
      </header>

      <AlertsStats stats={alerts.stats} />

      <AlertsFilterBar
        search={alerts.search}
        onSearchChange={alerts.setSearch}
        severity={alerts.severity}
        onSeverityChange={alerts.setSeverity}
        status={alerts.status}
        onStatusChange={alerts.setStatus}
      />

      <div
        className={`grid ${
          alerts.selectedAlert ? 'lg:grid-cols-2' : ''
        } gap-6`}
      >
        <AlertsList
          alerts={alerts.filteredAlerts}
          selectedAlert={alerts.selectedAlert}
          onSelect={alerts.setSelectedAlert}
        />

        {alerts.selectedAlert && (
  <AlertDetailsPanel
    alert={alerts.selectedAlert}
    onClose={() => alerts.setSelectedAlert(null)}
    onAcknowledge={alerts.acknowledgeAlert}
  />
)}
      </div>
    </div>
  );
}
