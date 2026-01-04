import type {
  SettingsPatient,
  SettingsDevice,
  DeviceAssignment,
} from '../types/settings.types';

interface ApplyAssignmentParams {
  patientId: string;
  deviceId: string | null; // null = unassign
  patients: SettingsPatient[];
  devices: SettingsDevice[];
  assignments: DeviceAssignment[];
}

export function applyAssignment({
  patientId,
  deviceId,
  patients,
  devices,
  assignments,
}: ApplyAssignmentParams) {
  const today = new Date().toISOString().split('T')[0];

  /* ---------------- Patients ---------------- */
  const nextPatients: SettingsPatient[] = patients.map(p =>
    p.id === patientId
      ? { ...p, assignedDevice: deviceId }
      : p
  );

  /* ---------------- Devices ---------------- */
  const nextDevices: SettingsDevice[] = devices.map(d => {
    // unassign any device currently linked to this patient
    if (d.assignedTo === patientId && d.deviceId !== deviceId) {
      return { ...d, assignedTo: null };
    }

    // assign new device
    if (deviceId && d.deviceId === deviceId) {
      return { ...d, assignedTo: patientId };
    }

    return d;
  });

  /* ---------------- Assignments (History) ---------------- */
  const closedAssignments: DeviceAssignment[] = assignments.map(a =>
    a.patientId === patientId && a.status === 'active'
      ? {
          ...a,
          status: 'inactive',
          dateUnassigned: today,
        }
      : a
  );

  // if unassign only → done
  if (!deviceId) {
    return {
      patients: nextPatients,
      devices: nextDevices,
      assignments: closedAssignments,
    };
  }

  // create new active assignment
  const patientName =
    patients.find(p => p.id === patientId)?.name ?? '';

  const newAssignment: DeviceAssignment = {
    id: crypto.randomUUID(),
    patientId,
    patientName,
    deviceId,
    dateAssigned: today,
    status: 'active',
  };

  return {
    patients: nextPatients,
    devices: nextDevices,
    assignments: [...closedAssignments, newAssignment],
  };
}
