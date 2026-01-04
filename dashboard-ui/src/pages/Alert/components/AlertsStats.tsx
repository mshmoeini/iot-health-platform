import { AlertCircle, TrendingUp } from 'lucide-react';

interface AlertsStatsProps {
  stats: {
    total: number;
    active: number;
    critical: number;
    warnings: number;
  };
}

export function AlertsStats({ stats }: AlertsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Alerts"
        value={stats.total}
        icon={<TrendingUp className="w-8 h-8 text-gray-400" />}
      />
      <StatCard
        label="Active Alerts"
        value={stats.active}
        icon={<AlertCircle className="w-8 h-8 text-blue-500" />}
      />
      <StatCard
        label="Critical"
        value={stats.critical}
        accent="red"
      />
      <StatCard
        label="Warnings"
        value={stats.warnings}
        accent="yellow"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accent?: 'red' | 'yellow';
}) {
  const accentStyles =
    accent === 'red'
      ? 'text-red-600 bg-red-100'
      : accent === 'yellow'
      ? 'text-yellow-600 bg-yellow-100'
      : '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-2xl mt-1 ${accent ? accentStyles.split(' ')[0] : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        {icon && icon}
        {accent && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accentStyles}`}>
            <span>{accent === 'red' ? '🔴' : '🟡'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
