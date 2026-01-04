import { Heart, Droplet, TrendingUp, AlertTriangle } from 'lucide-react';
import { HistoryStats } from '../../types/history.types';

type Props = {
  stats: HistoryStats;
};

export function HistorySummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Heart className="w-4 h-4" />
          Avg HR
        </div>
        <div className="text-2xl font-semibold">
          {stats.avgHeartRate} bpm
        </div>
        <div className="text-xs text-gray-500">
          Min {stats.minHeartRate} • Max {stats.maxHeartRate}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Droplet className="w-4 h-4" />
          Avg SpO₂
        </div>
        <div className="text-2xl font-semibold">
          {stats.avgSpo2}%
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <TrendingUp className="w-4 h-4" />
          Alerts
        </div>
        <div className="text-2xl font-semibold">
          {stats.alertsTriggered}
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <AlertTriangle className="w-4 h-4" />
          Risk Level
        </div>
        <div className="text-sm text-gray-700">
          Based on history
        </div>
      </div>

    </div>
  );
}
