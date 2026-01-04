import { Heart } from 'lucide-react';
import { MetricCard } from '../MetricCard';

interface AvgHeartRateCardProps {
  value: number;
}

export function AvgHeartRateCard({ value }: AvgHeartRateCardProps) {
  const progress = Math.min((value / 120) * 100, 100);

  return (
    <MetricCard
      icon={<Heart className="w-5 h-5" />}
      title="Avg Heart Rate"
      value={
        <div className="flex items-baseline gap-2">
          <span className="text-3xl text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">bpm</span>
        </div>
      }
      subtitle="Across all active patients"
      footer={
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3A7AFE] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      }
    />
  );
}
