import { Heart, Droplet, AlertTriangle, Battery } from 'lucide-react';

interface AggregatedMetricsProps {
  metrics: {
    avgHeartRate: number;
    avgSpo2: number;
    patientsInRisk: number;
    lowBatteryDevices: number;
  };
}

export function AggregatedMetrics({ metrics }: AggregatedMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Heart Rate */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Heart className="w-5 h-5" />
          <span className="text-sm">Avg Heart Rate</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl text-gray-900">{metrics.avgHeartRate}</span>
          <span className="text-sm text-gray-500">bpm</span>
        </div>
        <div className="text-xs text-gray-500">Across all active patients</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3A7AFE] transition-all duration-500"
              style={{ width: `${Math.min((metrics.avgHeartRate / 120) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Average SpO2 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Droplet className="w-5 h-5" />
          <span className="text-sm">Avg SpO₂</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl text-gray-900">{metrics.avgSpo2}</span>
          <span className="text-sm text-gray-500">%</span>
        </div>
        <div className="text-xs text-gray-500">Across all active patients</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                metrics.avgSpo2 < 90
                  ? 'bg-red-500'
                  : metrics.avgSpo2 < 95
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${metrics.avgSpo2}%` }}
            />
          </div>
        </div>
      </div>

      {/* Patients in Risk */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">Risk State</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl text-red-600">{metrics.patientsInRisk}</span>
          <span className="text-sm text-gray-500">patients</span>
        </div>
        <div className="text-xs text-gray-500">Require attention</div>
        <div className="mt-3">
          {metrics.patientsInRisk > 0 ? (
            <div className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full inline-block">
              Action Required
            </div>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full inline-block">
              All Clear
            </div>
          )}
        </div>
      </div>

      {/* Low Battery Devices */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Battery className="w-5 h-5" />
          <span className="text-sm">Low Battery</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl text-yellow-600">{metrics.lowBatteryDevices}</span>
          <span className="text-sm text-gray-500">devices</span>
        </div>
        <div className="text-xs text-gray-500">Below 30% charge</div>
        <div className="mt-3">
          {metrics.lowBatteryDevices > 0 ? (
            <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full inline-block">
              Maintenance Needed
            </div>
          ) : (
            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full inline-block">
              All Charged
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
