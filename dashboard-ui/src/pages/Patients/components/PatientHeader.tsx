import { Patient } from '../types/patient.types';
import { Badge } from '../../../app/components/ui/badge';
import { Clock } from 'lucide-react';

const statusStyles = {
  Normal: 'bg-green-100 text-green-800',
  Warning: 'bg-yellow-100 text-yellow-800',
  Critical: 'bg-red-100 text-red-800',
};

export function PatientHeader({ patient }: { patient: Patient }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex gap-6">
        {/* <img
          src={patient.photoUrl}
          className="w-24 h-24 rounded-full object-cover"
        /> */}
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl">{patient.name}</h2>
              <p className="text-gray-600">
                {patient.age} • {patient.gender}
              </p>
            </div>
            <Badge className={statusStyles[patient.healthStatus]}>
              {patient.healthStatus}
            </Badge>
          </div>

          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">Device</span>
              <div>{patient.deviceId}</div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {patient.lastUpdate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
