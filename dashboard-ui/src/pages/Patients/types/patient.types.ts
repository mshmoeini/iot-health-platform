export type PatientStatus = 'Normal' | 'Warning' | 'Critical';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  photoUrl: string;

  deviceId?: string;
  deviceStatus: 'active' | 'deactive'; // از backend

  healthStatus: 'Normal' | 'Warning' | 'Critical'; // از vitals
  hasNewAlert: boolean;
  lastUpdate?: string;

  heartRate: number;
  spo2: number;
  temperature: number;
}
