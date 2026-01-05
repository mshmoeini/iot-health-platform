import type { DashboardStats, SystemAlert,SystemOverviewData  } from '../types/dashboard.types';

export const mockDashboardStats: DashboardStats = {
  avgHeartRate: 72,
  avgSpo2: 97,
  patientsInRisk: 2,
  lowBatteryDevices: 3,
};

export const mockDashboardAlerts: SystemAlert[] = [
  {
    id: '1',
    severity: 'critical',
    alertType: 'Low SpO₂',
    description: 'SpO₂ dropped below 90%',
    deviceId: 'WB-1823',
    timestamp: '2 min ago',
    acknowledged: false,
  },
  {
    id: '2',
    severity: 'warning',
    alertType: 'High Heart Rate',
    description: 'Heart rate exceeded threshold',
    deviceId: 'WB-2047',
    timestamp: '5 min ago',
    acknowledged: false,
  },
];

export const mockAlertsTrend = Array.from({ length: 30 }).map((_, i) => ({
  time: `${i}s`,
  alerts: Math.floor(Math.random() * 5),
}));

export const mockVitalsTrend = Array.from({ length: 30 }).map((_, i) => ({
  time: `${i}s`,
  avgHeartRate: Math.floor(Math.random() * 20) + 65,
  avgSpo2: Math.floor(Math.random() * 6) + 92,
}));
export const systemOverviewMock: SystemOverviewData = {
  activeDevices: 24,
  patientsMonitored: 24,
  activeAlerts: 3,
  lastUpdate: 'Just now',
};