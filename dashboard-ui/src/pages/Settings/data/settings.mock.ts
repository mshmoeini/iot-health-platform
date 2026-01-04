import type {
  SettingsPatient,
  SettingsDevice,
  DeviceAssignment,
  SystemNotificationSettings,
} from '../types/settings.types';

/* ================= Patients ================= */
/**
 * status:
 * - active   → backend می‌گه device سالم + باتری کافی دارد
 * - deactive → backend می‌گه device مشکل دارد / باتری ندارد
 */

export const SETTINGS_PATIENTS_MOCK: SettingsPatient[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    patientId: 'PT-001',
    phone: '+1-555-0101',
    assignedDevice: 'WB-2047',
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Robert Mitchell',
    patientId: 'PT-002',
    phone: '+1-555-0201',
    assignedDevice: null,
    status: 'deactive',
  },
];

/* ================= Devices ================= */
/**
 * rule:
 * - assignedTo !== null → status = active
 * - assignedTo === null → status = deactive
 */

export const SETTINGS_DEVICES_MOCK: SettingsDevice[] = [
  {
    id: 'd1',
    deviceId: 'WB-2047',
    model: 'HealthBand Pro',
    battery: 85,

    // linked by patientId (NOT name)
    assignedTo: 'p1',

    lastSeen: '2 min ago',
    serialNumber: 'HBP-2047-X1',
    firmwareVersion: '2.1.4',
  },
  {
    id: 'd2',
    deviceId: 'WB-5621',
    model: 'HealthBand Lite',
    battery: 45,

    assignedTo: null, // unassigned → deactive (derived)

    lastSeen: '2 hours ago',
    serialNumber: 'HBL-5621-L2',
    firmwareVersion: '1.8.2',
  },
];


/* ================= Assignments ================= */
/**
 * فقط رابطه‌ی patient ↔ device
 * (کنترل دستی assign / unassign)
 */

export const SETTINGS_ASSIGNMENTS_MOCK: DeviceAssignment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    deviceId: 'WB-2047',
    dateAssigned: '2024-11-15',
    status: 'active',
  },
];

/* ================= System Notifications ================= */

export const SYSTEM_NOTIFICATION_SETTINGS_MOCK: SystemNotificationSettings = {
  smsEnabled: true,
  emergencyEscalation: true,
  emailEnabled: false,
  smsSender: '+1-555-HEALTH',
  systemEmail: 'alerts@healthmonitor.com',
  spo2Threshold: 90,
  hrThreshold: 120,
  batteryThreshold: 20,
  disconnectAlert: true,
};
