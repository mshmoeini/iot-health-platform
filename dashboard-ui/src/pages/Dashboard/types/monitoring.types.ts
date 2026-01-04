export interface AlertsTrendPoint {
  time: string;
  alerts: number;
}

export interface VitalsTrendPoint {
  time: string;
  avgHeartRate: number;
  avgSpo2: number;
}

export interface SystemMonitoringChartsProps {
  alertsTrendData: AlertsTrendPoint[];
  vitalsTrendData: VitalsTrendPoint[];
}
