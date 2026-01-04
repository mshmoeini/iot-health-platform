import { Activity, Wifi } from 'lucide-react';

interface NavigationBarProps {
  systemStatus: 'normal' | 'warning' | 'critical';
}

export function NavigationBar({ systemStatus }: NavigationBarProps) {
  const statusColors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-gray-900">HealthMonitor Pro</div>
          <div className="text-xs text-gray-500">Remote Patient Monitoring</div>
        </div>
      </div>

      
    </nav>
  );
}