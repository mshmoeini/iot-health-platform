import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';

import type { SystemNotificationSettings } from '../types/settings.types';

interface Props {
  settings: SystemNotificationSettings;
}

export function NotificationsTab({ settings }: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-gray-900">Notification Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">Heart Rate Threshold</label>
          <Input type="number" defaultValue={settings.hrThreshold} />
        </div>

        <div>
          <label className="text-sm">SpO₂ Threshold</label>
          <Input type="number" defaultValue={settings.spo2Threshold} />
        </div>

        <div>
          <label className="text-sm">Battery Threshold</label>
          <Input type="number" defaultValue={settings.batteryThreshold} />
        </div>
      </div>

      <Button>Save Notification Settings</Button>
    </div>
  );
}
