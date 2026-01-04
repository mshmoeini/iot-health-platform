import { X, CheckCircle } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { UIAlert } from '../types/alerts.types';

interface AlertDetailsPanelProps {
  alert: UIAlert;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export function AlertDetailsPanel({
  alert,
  onClose,
  onAcknowledge,
}: AlertDetailsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg text-gray-900">Alert Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Patient Info */}
      <div className="px-6 py-4 flex items-center gap-3 border-b">
        <img
          src={alert.patientPhoto}
          alt={alert.patientName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="text-gray-900 font-medium">
            {alert.patientName}
          </div>
          <div className="text-sm text-gray-500">
            Device ID: {alert.deviceId}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {alert.fullDescription}
        </p>
      </div>

      {/* Vitals Snapshot */}
      {alert.vitalsSnapshot && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-gray-500 mb-1">Heart Rate</div>
              <div className="text-gray-900 font-medium">
                {alert.vitalsSnapshot.heartRate} bpm
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-gray-500 mb-1">SpO₂</div>
              <div className="text-gray-900 font-medium">
                {alert.vitalsSnapshot.spo2}%
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-gray-500 mb-1">Temperature</div>
              <div className="text-gray-900 font-medium">
                {alert.vitalsSnapshot.temperature}°C
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action */}
      <div className="px-6 py-4 border-t">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          disabled={alert.status !== 'new'}
          onClick={() => onAcknowledge(alert.id)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {alert.status === 'acknowledged'
            ? 'Acknowledged'
            : 'Mark as Acknowledged'}
        </Button>
      </div>
    </div>
  );
}
