import { Search } from 'lucide-react';
import { Input } from '../../../app/components/ui/input';

interface AlertsFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  severity: 'all' | 'critical' | 'warning' | 'info';
  onSeverityChange: (v: any) => void;
  status: 'all' | 'new' | 'acknowledged' | 'resolved';
  onStatusChange: (v: any) => void;
}

export function AlertsFilterBar({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  status,
  onStatusChange,
}: AlertsFilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search alerts..."
            className="pl-10"
          />
        </div>

        {/* Severity */}
        <div className="flex gap-2">
          {['all', 'critical', 'warning', 'normal'].map((s) => (
            <button
              key={s}
              onClick={() => onSeverityChange(s)}
              className={`px-3 py-2 rounded-lg text-sm ${
                severity === s
                  ? 'bg-[#3A7AFE] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}
