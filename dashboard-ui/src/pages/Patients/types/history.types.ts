export interface HistoryPoint {
  time: string;
  heartRate: number;
  spo2: number;
  temperature: number;
}

export interface HistoryStats {
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  avgSpo2: number;
  alertsTriggered: number;
}