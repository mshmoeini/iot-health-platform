import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface Alert {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
  time: string;
  acknowledged: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900">Risk Events & Alerts</h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xs text-red-600">{activeAlerts.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
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
                      className={`text-sm ${
                        alert.severity === 'critical' ? 'text-red-900' : 'text-yellow-900'
                      }`}
                    >
                      {alert.title}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      alert.severity === 'critical' ? 'text-red-700' : 'text-yellow-700'
                    }`}
                  >
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{alert.time}</span>
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
