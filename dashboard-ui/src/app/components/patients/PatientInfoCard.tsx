import { Badge } from '../ui/badge';
import { Bluetooth } from 'lucide-react';

interface PatientInfoCardProps {
  patient: {
    name: string;
    age: number;
    deviceId: string;
    photoUrl: string;
    lastUpdate: string;
    healthStatus: 'Normal' | 'Warning' | 'Critical';
  };
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const statusVariants = {
    Normal: 'bg-green-100 text-green-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 mb-4">Patient Information</h3>
      
      <div className="flex flex-col items-center mb-4">
        <img
          src={patient.photoUrl}
          alt={patient.name}
          className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-gray-100"
        />
        <div className="text-gray-900 text-center">{patient.name}</div>
        <div className="text-sm text-gray-500">{patient.age} years old</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Device ID</span>
          <div className="flex items-center gap-1">
            <Bluetooth className="w-3 h-3 text-[#3A7AFE]" />
            <span className="text-sm text-gray-900">{patient.deviceId}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Last Update</span>
          <span className="text-sm text-gray-900">{patient.lastUpdate}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600">Health Status</span>
          <Badge className={statusVariants[patient.healthStatus]}>
            {patient.healthStatus}
          </Badge>
        </div>
      </div>
    </div>
  );
}
