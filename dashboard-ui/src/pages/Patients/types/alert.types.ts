export interface PatientAlert {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}
