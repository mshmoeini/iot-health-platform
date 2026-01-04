import {
  ChevronRight,
  Heart,
  Droplet,
  Thermometer,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import { Badge } from '../../../app/components/ui/badge';
import type { Patient } from '../types/patient.types';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

const healthStatusStyles: Record<Patient['healthStatus'], string> = {
  Normal: 'bg-green-100 text-green-800',
  Warning: 'bg-yellow-100 text-yellow-800',
  Critical: 'bg-red-100 text-red-800',
};

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-4 hover:shadow-md cursor-pointer transition flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          {/* <img
            src={patient.photoUrl}
            alt={patient.name}
            className="w-12 h-12 rounded-full object-cover"
          /> */}

          <div>
            <h3 className="text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">
              {patient.age} yrs • {patient.gender}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
      </div>

      {/* Health Status + Alerts */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={healthStatusStyles[patient.healthStatus]}>
          {patient.healthStatus}
        </Badge>

        {patient.deviceStatus === 'deactive' && (
          <Badge className="bg-gray-200 text-gray-600 flex items-center gap-1">
            <WifiOff className="w-3 h-3" />
            Device Offline
          </Badge>
        )}

        {patient.hasNewAlert && (
          <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            New Alert
          </Badge>
        )}
      </div>

      {/* Device + Time */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Device: {patient.deviceId ?? 'Unassigned'}</span>
        {patient.lastUpdate && <span>{patient.lastUpdate}</span>}
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>{patient.heartRate} bpm</span>
        </div>

        <div className="flex items-center gap-1">
          <Droplet className="w-4 h-4 text-blue-500" />
          <span>{patient.spo2}%</span>
        </div>

        <div className="flex items-center gap-1">
          <Thermometer className="w-4 h-4 text-orange-500" />
          <span>{patient.temperature}°C</span>
        </div>
      </div>
    </div>
  );
}
