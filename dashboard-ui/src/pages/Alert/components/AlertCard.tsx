import { Clock, ChevronRight } from 'lucide-react';
import { Badge } from '../../../app/components/ui/badge';
import { UIAlert } from '../types/alerts.types';

export function AlertCard({
  alert,
  selected,
  onClick,
}: {
  alert: UIAlert;
  selected: boolean;
  onClick: () => void;
}) {
  const severityColor = {
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const statusColor = {
    new: 'bg-red-100 text-red-800',
    acknowledged: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition cursor-pointer ${
        selected ? 'border-[#3A7AFE] ring-2 ring-[#3A7AFE]/20' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <img
          src={alert.patientPhoto}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div className="flex gap-2">
              <Badge className={severityColor[alert.severity]}>
                {alert.severity}
              </Badge>
              <Badge className={statusColor[alert.status]}>
                {alert.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp}
            </div>
          </div>

          <h3 className="text-gray-900">{alert.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>

          <div className="text-sm text-gray-500 flex justify-between">
            <span>{alert.patientName}</span>
            <ChevronRight className="w-4 h-4 text-[#3A7AFE]" />
          </div>
        </div>
      </div>
    </div>
  );
}
