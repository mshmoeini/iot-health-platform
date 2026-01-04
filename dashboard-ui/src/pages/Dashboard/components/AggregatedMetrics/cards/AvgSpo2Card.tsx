import { Droplet } from 'lucide-react';
import { MetricCard } from '../MetricCard';

interface AvgSpo2CardProps {
  value: number;
}

export function AvgSpo2Card({ value }: AvgSpo2CardProps) {
  const barColor =
    value < 90
      ? 'bg-red-500'
      : value < 95
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <MetricCard
      icon={<Droplet className="w-5 h-5" />}
      title="Avg SpO₂"
      value={
        <div className="flex items-baseline gap-2">
          <span className="text-3xl text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">%</span>
        </div>
      }
      subtitle="Across all active patients"
      footer={
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${value}%` }}
          />
        </div>
      }
    />
  );
}
