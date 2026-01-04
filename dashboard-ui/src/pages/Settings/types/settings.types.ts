/* ================= Tabs ================= */

export type SettingsTab =
  | 'patients'
  | 'devices'
  | 'assignments'
  | 'notifications'
  | 'system';

/* ================= Patients ================= */
/**
 * status:
 * - active   → backend says patient/device is connected & healthy
 * - deactive → backend says disconnected / low battery / issue
 *
 * ❗ UI must NOT create or modify status
 * ❗ status may be missing in create form
 */
export interface SettingsPatient {
  id: string;
  name: string;
  patientId: string;
  phone: string;

  // relationship (managed by dashboard)
  assignedDevice: string | null;

  // backend source of truth
  status?: 'active' | 'deactive'; // ✅ OPTIONAL
}

/* ================= Devices ================= */
/**
 * status is DERIVED:
 * - assignedTo !== null → active
 * - assignedTo === null → deactive
 *
 * ❗ DO NOT store status
 */
export interface SettingsDevice {
  id: string;
  deviceId: string; // WB-2047
  model: string; // HealthBand Pro

  battery: number;

  // relationship
  assignedTo: string | null;

  // meta
  lastSeen?: string;
  serialNumber?: string;
  firmwareVersion?: string;
}

/* ================= Assignments ================= */
/**
 * History of patient ↔ device relationship
 * No health logic
 */
export interface DeviceAssignment {
  id: string;
  patientId: string;
  patientName: string;
  deviceId: string;

  dateAssigned: string;
  dateUnassigned?: string;

  status: 'active' | 'inactive';
}

/* ================= System Notifications ================= */

export interface SystemNotificationSettings {
  smsEnabled: boolean;
  emergencyEscalation: boolean;
  emailEnabled: boolean;
  smsSender: string;
  systemEmail: string;
  spo2Threshold: number;
  hrThreshold: number;
  batteryThreshold: number;
  disconnectAlert: boolean;
}
