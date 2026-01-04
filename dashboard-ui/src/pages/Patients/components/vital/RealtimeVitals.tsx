import {
  Heart,
  Droplet,
  Thermometer,
  Activity,
  Battery
} from 'lucide-react';
import { Vitals } from '../../types/vitals.types';

type Props = {
  vitals: Vitals;
};

export function RealtimeVitals({ vitals }: Props) {
  const getColor = (type: 'hr' | 'spo2' | 'temp', value: number) => {
    if (type === 'hr') {
      if (value > 100 || value < 60) return 'text-red-600';
      if (value > 90) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'spo2') {
      if (value < 90) return 'bg-red-500';
      if (value < 95) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    if (type === 'temp') {
      if (value >= 38) return 'text-red-600';
      if (value >= 37.5) return 'text-yellow-600';
      return 'text-green-600';
    }
  };

  const getTempStatus = (value: number) => {
    if (value >= 38) return { label: 'High', color: 'bg-red-500' };
    if (value >= 37.5) return { label: 'Elevated', color: 'bg-yellow-500' };
    return { label: 'Normal', color: 'bg-green-500' };
  };

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Real-Time Vital Signs
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

        {/* ================= Heart Rate ================= */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Heart className="w-4 h-4" />
            Heart Rate
          </div>

          <div className={`text-3xl font-semibold ${getColor('hr', vitals.heartRate)}`}>
            {vitals.heartRate}
            <span className="text-sm text-gray-500 ml-1">bpm</span>
          </div>

          {/* mini waveform */}
          <div className="mt-2 h-2 w-full bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 animate-pulse"
              style={{ width: `${Math.min(100, vitals.heartRate)}%` }}
            />
          </div>
        </div>

        {/* ================= SpO2 ================= */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Droplet className="w-4 h-4" />
            SpO₂
          </div>

          <div className="text-3xl font-semibold text-gray-900">
            {vitals.spo2}
            <span className="text-sm text-gray-500 ml-1">%</span>
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getColor('spo2', vitals.spo2)}`}
              style={{ width: `${vitals.spo2}%` }}
            />
          </div>
        </div>

        {/* ================= Temperature ================= */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Thermometer className="w-4 h-4" />
            Temperature
          </div>

          <div className={`text-3xl font-semibold ${getColor('temp', vitals.temperature)}`}>
            {vitals.temperature}
            <span className="text-sm text-gray-500 ml-1">°C</span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <span
              className={`w-2 h-2 rounded-full ${getTempStatus(vitals.temperature).color}`}
            />
            {getTempStatus(vitals.temperature).label}
          </div>
        </div>

        {/* ================= Activity ================= */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Activity className="w-4 h-4" />
            Activity
          </div>

          <div className="text-xl text-gray-900">
            {vitals.activityLevel}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            Motion detected
          </div>
        </div>

        {/* ================= Battery ================= */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Battery className="w-4 h-4" />
            Battery
          </div>

          <div className="text-3xl font-semibold text-gray-900">
            {vitals.batteryLevel}
            <span className="text-sm text-gray-500 ml-1">%</span>
          </div>

          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                vitals.batteryLevel < 20
                  ? 'bg-red-500'
                  : vitals.batteryLevel < 50
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${vitals.batteryLevel}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
