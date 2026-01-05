export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'JUST_GENERATED' | 'ACKNOWLEDGED' | 'CLININALLY_ASSESSED'|'CLOSED';

export interface UIAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  fullDescription: string;
  patientName: string;
  patientPhoto: string;
  acknowledged: boolean;
  alertType: string;   
  deviceId: string;
  timestamp: string;
  timestampDate: Date;
  status: AlertStatus;
  vitalsSnapshot?: {
    heartRate: number;
    spo2: number;
    temperature: number;
  };
  similarAlertsCount?: number;
}
