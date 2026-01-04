import type { Patient } from '../types/patient.types';

export const PATIENTS_MOCK: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 62,
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00',
    deviceId: 'WB-2047',
    deviceStatus: 'active',
    heartRate: 72,
    spo2: 98,
    temperature: 36.8,

    healthStatus: 'Normal',
    hasNewAlert: false,
    lastUpdate: '2 min ago',
  },
  {
    id: '2',
    name: 'Robert Mitchell',
    age: 58,
    gender: 'male',
    deviceStatus: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1758691461888-b74515208d7a',
    deviceId: 'WB-1823',

    heartRate: 105,
    spo2: 89,
    temperature: 37.9,

    healthStatus: 'Critical',
    hasNewAlert: true,
    lastUpdate: 'Just now',
  },
  {
    id: '3',
    name: 'Margaret Williams',
    age: 71,
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
    deviceId: 'WB-3156',

    heartRate: 92,
    spo2: 94,
    temperature: 37.2,
    deviceStatus: 'active',
    healthStatus: 'Warning',
    hasNewAlert: true,
    lastUpdate: '5 min ago',
  },
];
