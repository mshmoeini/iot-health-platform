import { useEffect, useState } from 'react';
import { getSettingsData } from '../repositories/settings.repository';

import type {
  SettingsPatient,
  SettingsDevice,
  DeviceAssignment,
  SystemNotificationSettings,
} from '../types/settings.types';

import { applyAssignment } from '../helpers/assignments.helpers';

export function useSettings() {
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<SettingsPatient[]>([]);
  const [devices, setDevices] = useState<SettingsDevice[]>([]);
  const [assignments, setAssignments] = useState<DeviceAssignment[]>([]);
  const [notificationSettings, setNotificationSettings] =
    useState<SystemNotificationSettings | null>(null);

  /* ---------------- Initial load ---------------- */
  useEffect(() => {
    getSettingsData().then(res => {
      setPatients(res.patients);
      setDevices(res.devices); // ❌ no status sync
      setAssignments(res.assignments);
      setNotificationSettings(res.notificationSettings);
      setLoading(false);
    });
  }, []);

  /* ---------------- Patients ---------------- */
  function savePatient(patient: SettingsPatient) {
    setPatients(prev =>
      prev.some(p => p.id === patient.id)
        ? prev.map(p => (p.id === patient.id ? patient : p))
        : [...prev, patient]
    );
  }

  function deletePatient(patientId: string) {
    // deleting patient = unassign
    const result = applyAssignment({
      patientId,
      deviceId: null,
      patients,
      devices,
      assignments,
    });

    setPatients(result.patients.filter(p => p.id !== patientId));
    setDevices(result.devices);
    setAssignments(result.assignments);
  }

  /* ---------------- Assign / Unassign (SINGLE SOURCE) ---------------- */
  function assignDeviceToPatient(
    patientId: string,
    deviceId: string | null
  ) {
    const result = applyAssignment({
      patientId,
      deviceId,
      patients,
      devices,
      assignments,
    });

    setPatients(result.patients);
    setDevices(result.devices);
    setAssignments(result.assignments);
  }

  /* ---------------- Devices ---------------- */
  function addDevice(device: SettingsDevice) {
    setDevices(prev => [
      ...prev,
      {
        ...device,
        assignedTo: device.assignedTo ?? null,
      },
    ]);
  }

  /* ---------------- Return API ---------------- */
  return {
    loading,

    patients,
    devices,
    assignments,
    notificationSettings,

    savePatient,
    deletePatient,
    assignDeviceToPatient,
    addDevice,
    setNotificationSettings,
  };
}
