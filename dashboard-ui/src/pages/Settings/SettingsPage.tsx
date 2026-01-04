import { useState } from 'react';
import {
  Users,
  Wifi,
  Link,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react';

import { useSettings } from './hook/useSettings';
import type { SettingsTab, SettingsPatient } from './types/settings.types';

import { PatientsTab } from './components/PatientsTab';
import { DevicesTab } from './components/DevicesTab';
import { AssignmentsTab } from './components/AssignmentsTab';
import { NotificationsTab } from './components/NotificationsTab';
import { SystemTab } from './components/SystemTab';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('patients');

  const {
    loading,
    patients,
    devices,
    assignments,
    notificationSettings,

    // actions (single source)
    savePatient,
    deletePatient,
    assignDeviceToPatient,
    addDevice,
  } = useSettings();

  if (loading || !notificationSettings) {
    return <div className="py-20 text-center">Loading settings…</div>;
  }

  const tabs = [
    { id: 'patients' as SettingsTab, label: 'Patients', icon: Users },
    { id: 'devices' as SettingsTab, label: 'Devices', icon: Wifi },
    { id: 'assignments' as SettingsTab, label: 'Assignments', icon: Link },
    // { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'system' as SettingsTab, label: 'System', icon: SettingsIcon },
  ];

  /* ================= Handlers ================= */

  function handleSavePatient(patient: SettingsPatient) {
  const isNew = !patients.some(p => p.id === patient.id);

  // 1️⃣ همیشه patient رو save کن
  savePatient(patient);

  // 2️⃣ فقط اگر edit هست assign کن
  if (!isNew) {
    assignDeviceToPatient(patient.id, patient.assignedDevice);
  }
}


  function handleUnassign(patientId: string) {
    assignDeviceToPatient(patientId, null);
  }

  /* ================= Render ================= */

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-gray-900">Settings</h2>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'patients' && (
        <PatientsTab
          patients={patients}
          devices={devices}
          onSavePatient={handleSavePatient}
          onDeletePatient={deletePatient}
        />
      )}

      {activeTab === 'devices' && (
        <DevicesTab
          devices={devices}
          onAddDevice={addDevice}
        />
      )}

      {activeTab === 'assignments' && (
        <AssignmentsTab
          assignments={assignments}
          devices={devices}
          onUnassign={handleUnassign}
        />
      )}

      {activeTab === 'notifications' && (
        <NotificationsTab settings={notificationSettings} />
      )}

      {activeTab === 'system' && <SystemTab />}
    </div>
  );
}
