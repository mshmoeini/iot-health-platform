import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';

interface Alert {
  id: string;
  severity: 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

export function PatientAlerts({ alerts }: { alerts: Alert[] }) {
  // ================= EMPTY STATE =================
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <h3 className="text-gray-900 mb-1">No Alerts</h3>
        <p className="text-sm text-gray-500">
          This patient has no active alerts at the moment.
        </p>
      </div>
    );
  }

  // ================= ALERT LIST =================
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-xl border-l-4 p-4 ${
            alert.severity === 'critical'
              ? 'border-red-500 bg-red-50'
              : 'border-yellow-500 bg-yellow-50'
          } ${alert.acknowledged ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    alert.severity === 'critical'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                />
                <span className="text-sm font-medium text-gray-900">
                  {alert.title}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                {alert.description}
              </p>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {alert.timestamp}
              </div>
            </div>

            {!alert.acknowledged && (
              <Button size="sm" variant="outline">
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
