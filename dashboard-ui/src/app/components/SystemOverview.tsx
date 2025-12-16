import { Activity, Users, AlertTriangle, Wifi, Clock } from 'lucide-react';

interface SystemOverviewProps {
  systemStatus: 'normal' | 'warning' | 'critical';
  activeDevices: number;
  patientsMonitored: number;
  activeAlerts: number;
  lastUpdate: string;
}

export function SystemOverview({
  systemStatus,
  activeDevices,
  patientsMonitored,
  activeAlerts,
  lastUpdate,
}: SystemOverviewProps) {
  const statusConfig = {
    normal: { color: 'bg-green-500', text: 'All Systems Normal' },
    warning: { color: 'bg-yellow-500', text: 'Warning - Attention Required' },
    critical: { color: 'bg-red-500', text: 'Critical - Immediate Action' },
  };

  const config = statusConfig[systemStatus];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-gray-900 mb-6">System Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* System Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="w-4 h-4" />
            <span className="text-sm">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.color} shadow-lg animate-pulse`} />
            <span className="text-sm text-gray-900">{config.text}</span>
          </div>
        </div>

        {/* Active Devices */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Active Devices</span>
          </div>
          <div className="text-2xl text-gray-900">{activeDevices}</div>
          <div className="text-xs text-gray-500">Connected</div>
        </div>

        {/* Patients Monitored */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">Patients</span>
          </div>
          <div className="text-2xl text-gray-900">{patientsMonitored}</div>
          <div className="text-xs text-gray-500">Being monitored</div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Active Alerts</span>
          </div>
          <div className="text-2xl text-red-600">{activeAlerts}</div>
          <div className="text-xs text-gray-500">Unacknowledged</div>
        </div>

        {/* Last Update */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last Update</span>
          </div>
          <div className="text-sm text-gray-900">{lastUpdate}</div>
          <div className="text-xs text-gray-500">System sync</div>
        </div>
      </div>
    </div>
  );
}
