export type AlertSeverity = 'critical' | 'warning';

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  alertType: string;
  description: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AggregatedMetrics {
  avgHeartRate: number;
  avgSpo2: number;
  patientsInRisk: number;
  lowBatteryDevices: number;
}

export type DashboardStats = {
  avgHeartRate: number;        // میانگین ضربان قلب کل سیستم
  avgSpo2: number;             // میانگین SpO₂ کل سیستم
  patientsInRisk: number;      // تعداد بیماران در وضعیت ریسک
  lowBatteryDevices: number;   // تعداد دیوایس‌های با باتری کم
};
export interface SystemOverviewData {

  activeDevices: number;
  patientsMonitored: number;
  activeAlerts: number;
  lastUpdate: string;
}