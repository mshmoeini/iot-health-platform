import { AlertTriangle } from 'lucide-react';
import { MetricCard } from '../MetricCard';

interface RiskPatientsCardProps {
  value: number;
}

export function RiskPatientsCard({ value }: RiskPatientsCardProps) {
  return (
    <MetricCard
      icon={<AlertTriangle className="w-5 h-5" />}
      title="Risk State"
      value={
        <div className="flex items-baseline gap-2">
          <span className="text-3xl text-red-600">{value}</span>
          <span className="text-sm text-gray-500">patients</span>
        </div>
      }
      subtitle="Require attention"
      footer={
        value > 0 ? (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
            Action Required
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            All Clear
          </span>
        )
      }
    />
  );
}
