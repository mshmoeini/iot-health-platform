import { Heart, Droplet, Thermometer, Activity, Battery } from 'lucide-react';
import { LineChart, Line } from 'recharts';

interface RealTimeVitalsProps {
  vitals: {
    heartRate: number;
    spo2: number;
    temperature: number;
    activityLevel: string;
    batteryLevel: number;
    heartRateHistory: number[];
  };
}

export function RealTimeVitals({ vitals }: RealTimeVitalsProps) {
  const heartRateData = vitals.heartRateHistory.map((value, index) => ({ value }));

  const getTemperatureColor = (temp: number) => {
    if (temp >= 38) return 'text-red-600';
    if (temp >= 37.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSpo2Color = (spo2: number) => {
    if (spo2 < 90) return 'text-red-600';
    if (spo2 < 95) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getHeartRateColor = (hr: number) => {
    if (hr > 100 || hr < 60) return 'text-red-600';
    if (hr > 90 || hr < 65) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 mb-6">Real-Time Vitals</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Heart Rate */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Heart Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl ${getHeartRateColor(vitals.heartRate)}`}>
              {vitals.heartRate}
            </span>
            <span className="text-sm text-gray-500">bpm</span>
          </div>
          <div className="h-12 -mx-2">
            <LineChart width={140} height={48} data={heartRateData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3A7AFE"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </div>
        </div>

        {/* SpO2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Droplet className="w-4 h-4" />
            <span className="text-sm">SpO₂</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl ${getSpo2Color(vitals.spo2)}`}>
              {vitals.spo2}
            </span>
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="relative pt-2">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  vitals.spo2 < 90
                    ? 'bg-red-500'
                    : vitals.spo2 < 95
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${vitals.spo2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Temperature</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl ${getTemperatureColor(vitals.temperature)}`}>
              {vitals.temperature}
            </span>
            <span className="text-sm text-gray-500">°C</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                vitals.temperature >= 38
                  ? 'bg-red-500'
                  : vitals.temperature >= 37.5
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
            <span className="text-xs text-gray-500">
              {vitals.temperature >= 38
                ? 'High'
                : vitals.temperature >= 37.5
                ? 'Elevated'
                : 'Normal'}
            </span>
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Activity</span>
          </div>
          <div className="text-xl text-gray-900">{vitals.activityLevel}</div>
          <div className="text-xs text-gray-500">Motion detected</div>
        </div>

        {/* Battery Level */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Battery className="w-4 h-4" />
            <span className="text-sm">Wristband</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-gray-900">{vitals.batteryLevel}</span>
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
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
    </div>
  );
}
