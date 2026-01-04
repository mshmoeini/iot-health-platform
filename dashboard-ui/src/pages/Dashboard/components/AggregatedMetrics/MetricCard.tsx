interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle: string;
  footer?: React.ReactNode;
}

export function MetricCard({
  icon,
  title,
  value,
  subtitle,
  footer,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <div className="mb-2">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
