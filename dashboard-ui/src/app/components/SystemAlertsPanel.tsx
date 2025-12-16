import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning';
  alertType: string;
  description: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

interface SystemAlertsPanelProps {
  alerts: SystemAlert[];
  onAcknowledge: (id: string) => void;
}

export function SystemAlertsPanel({ alerts, onAcknowledge }: SystemAlertsPanelProps) {
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900">System-Wide Alerts</h3>
          <p className="text-sm text-gray-500">Recent events across all devices</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-sm text-red-600">{activeAlerts.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-900 mb-1">No Active Alerts</p>
            <p className="text-sm text-gray-500">All systems operating normally</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 transition-all ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-yellow-50 border-yellow-500'
              } ${alert.acknowledged ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    />
                    <span
                      className={`${
                        alert.severity === 'critical' ? 'text-red-900' : 'text-yellow-900'
                      }`}
                    >
                      {alert.alertType}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      alert.severity === 'critical' ? 'text-red-700' : 'text-yellow-700'
                    }`}
                  >
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                      Device: {alert.deviceId}
                    </div>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAcknowledge(alert.id)}
                    className="shrink-0"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
