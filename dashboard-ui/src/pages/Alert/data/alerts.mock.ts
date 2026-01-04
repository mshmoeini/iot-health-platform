import { UIAlert } from '../types/alerts.types';

export const ALERTS_MOCK: UIAlert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Critical SpO₂ Level',
    description: 'SpO₂ dropped below 90%',
    fullDescription: 'Patient SpO₂ level has dropped to 88%...',
    patientName: 'Robert Mitchell',
    patientPhoto: 'https://...',
    deviceId: 'WB-1823',
    timestamp: 'Just now',
    timestampDate: new Date(),
    status: 'new',
    vitalsSnapshot: {
      heartRate: 105,
      spo2: 88,
      temperature: 37.9,
    },
    similarAlertsCount: 3,
  },
  {
    id: '2',
    severity: 'critical',
    title: 'Critical SpO₂ Level',
    description: 'SpO₂ drccccccccccccccopped below 90%',
    fullDescription: 'Patient SpO₂ levelddddddddd has dropped to 88%...',
    patientName: 'Robert Mitchell',
    patientPhoto: 'https://...',
    deviceId: 'WB-1823',
    timestamp: 'Just now',
    timestampDate: new Date(),
    status: 'new',
    vitalsSnapshot: {
      heartRate: 105,
      spo2: 88,
      temperature: 37.9,
    },
    similarAlertsCount: 3,
  },
];
