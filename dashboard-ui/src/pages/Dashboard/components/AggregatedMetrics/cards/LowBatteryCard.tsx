import { Battery } from 'lucide-react';
import { MetricCard } from '../MetricCard';

interface LowBatteryCardProps {
  value: number;
}

export function LowBatteryCard({ value }: LowBatteryCardProps) {
  return (
    <MetricCard
      icon={<Battery className="w-5 h-5" />}
      title="Low Battery"
      value={
        <div className="flex items-baseline gap-2">
          <span className="text-3xl text-yellow-600">{value}</span>
          <span className="text-sm text-gray-500">devices</span>
        </div>
      }
      subtitle="Below 30% charge"
      footer={
        value > 0 ? (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            Maintenance Needed
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            All Charged
          </span>
        )
      }
    />
  );
}
