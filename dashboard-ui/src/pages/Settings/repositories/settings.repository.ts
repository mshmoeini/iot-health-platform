import {
  SETTINGS_PATIENTS_MOCK,
  SETTINGS_DEVICES_MOCK,
  SETTINGS_ASSIGNMENTS_MOCK,
  SYSTEM_NOTIFICATION_SETTINGS_MOCK,
} from '../data/settings.mock';

export async function getSettingsData() {
  await new Promise(res => setTimeout(res, 300));

  return {
    patients: SETTINGS_PATIENTS_MOCK,
    devices: SETTINGS_DEVICES_MOCK,
    assignments: SETTINGS_ASSIGNMENTS_MOCK,
    notificationSettings: SYSTEM_NOTIFICATION_SETTINGS_MOCK,
  };
}
