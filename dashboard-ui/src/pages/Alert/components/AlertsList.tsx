import { UIAlert } from '../types/alerts.types';
import { AlertCard } from './AlertCard';

interface AlertsListProps {
  alerts: UIAlert[];
  selectedAlert: UIAlert | null;
  onSelect: (a: UIAlert) => void;
}

export function AlertsList({
  alerts,
  selectedAlert,
  onSelect,
}: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No alerts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          selected={selectedAlert?.id === alert.id}
          onClick={() => onSelect(alert)}
        />
      ))}
    </div>
  );
}
