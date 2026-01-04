import {
  User,
  Phone,
  Heart,
  Droplet,
  Thermometer,
  Battery,
  Wifi,
  Send,
  Save,
  RotateCcw,
} from 'lucide-react';

import { NotificationSettings as Settings } from '../../types/notification.types';
import { Button } from '../../../../app/components/ui/button';
import { Input } from '../../../../app/components/ui/input';
import { Badge } from '../../../../app/components/ui/badge';

interface Props {
  settings: Settings;
}

export function NotificationSettings({ settings }: Props) {
  return (
    <div className="space-y-6">

      {/* ================= Notification Summary ================= */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-gray-900">
          <User className="h-5 w-5 text-blue-600" />
          Notification Summary
        </h3>

        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <div className="text-gray-500">Primary Caregiver</div>
            <div className="text-gray-900">{settings.caregiverName}</div>
            <div className="mt-1 flex items-center gap-1 text-gray-600">
              <Phone className="h-3 w-3" />
              {settings.caregiverPhone}
            </div>
          </div>

          <div>
            <div className="text-gray-500">Emergency Contact</div>
            <div className="text-gray-900">{settings.emergencyContactName}</div>
            <div className="mt-1 flex items-center gap-1 text-gray-600">
              <Phone className="h-3 w-3" />
              {settings.emergencyContactPhone}
            </div>
          </div>

          <div>
            <div className="text-gray-500">Preferred Communication</div>
            <div className="capitalize text-gray-900">
              {settings.preferredMethod}
            </div>
          </div>

          <div>
            <div className="text-gray-500">Last Notification</div>
            <div className="text-gray-900">
              {settings.lastNotificationSent}
            </div>
            <Badge className="mt-1 bg-green-100 text-green-800">
              {settings.lastNotificationStatus}
            </Badge>
          </div>
        </div>
      </div>

      {/* ================= SMS Settings ================= */}
      <div className="rounded-xl border bg-white p-6 space-y-5">
        <h3 className="text-gray-900">Patient-Specific SMS Settings</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
        <label className="text-sm text-gray-700">Primary Caregiver Name</label>
        <Input value={settings.caregiverName} readOnly />
        </div>

       <div className="space-y-1">
       <label className="text-sm text-gray-700">Primary Caregiver Phone</label>
       <Input value={settings.caregiverPhone} readOnly />
       </div>

  <div className="space-y-1">
    <label className="text-sm text-gray-700">Emergency Contact Name</label>
    <Input value={settings.emergencyContactName} readOnly />
  </div>

  <div className="space-y-1">
    <label className="text-sm text-gray-700">Emergency Contact Phone</label>
    <Input value={settings.emergencyContactPhone} readOnly />
  </div>
</div>


        <Toggle
          label="Enable SMS Alerts for this patient"
          enabled={settings.smsAlertsEnabled}
        />

        <Toggle
          label="Enable Emergency Escalation SMS"
          enabled={settings.emergencyEscalationEnabled}
        />

        <div>
          <label className="mb-1 block text-sm text-gray-700">
            Preferred Communication Method
          </label>
          <select
            value={settings.preferredMethod}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="both">SMS + Email</option>
          </select>
        </div>

        <Button variant="outline" className="gap-2">
          <Send className="h-4 w-4" />
          Test SMS (Send to Caregiver)
        </Button>
      </div>

      {/* ================= Alert Rules ================= */}
      <div className="rounded-xl border bg-white p-6 space-y-5">
        <h3 className="text-gray-900">Patient-Specific Alert Rules</h3>
        <p className="text-sm text-gray-500">
          Leave blank to use global defaults
        </p>

        <Threshold
          icon={<Heart className="h-4 w-4" />}
          label="Notify when Heart Rate exceeds"
          value={settings.customHeartRateThreshold}
          unit="bpm"
          defaultValue="120 bpm"
        />

        <Threshold
          icon={<Droplet className="h-4 w-4" />}
          label="Notify when SpO₂ drops below"
          value={settings.customSpo2Threshold}
          unit="%"
          defaultValue="90 %"
        />

        <Threshold
          icon={<Thermometer className="h-4 w-4" />}
          label="Notify when Temperature exceeds"
          value={settings.customTempThreshold}
          unit="°C"
          defaultValue="38 °C"
        />

        <Toggle
          label="Notify on device disconnect"
          enabled={settings.notifyOnDisconnect}
          icon={<Wifi className="h-4 w-4" />}
        />

        <Toggle
          label="Notify on low battery (<20%)"
          enabled={settings.notifyOnLowBattery}
          icon={<Battery className="h-4 w-4" />}
        />
      </div>

      {/* ================= Actions ================= */}
      <div className="flex gap-3">
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4" />
          Save Notification Settings
        </Button>

        <Button variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset to Global Defaults
        </Button>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */

function Toggle({
  label,
  enabled,
  icon,
}: {
  label: string;
  enabled: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-sm text-gray-900">
        {icon}
        {label}
      </div>
      <div
        className={`relative h-6 w-10 rounded-full ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            enabled ? 'left-5' : 'left-1'
          }`}
        />
      </div>
    </div>
  );
}

function Threshold({
  icon,
  label,
  value,
  unit,
  defaultValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  defaultValue: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-900">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        <Input type="number" value={value} className="w-24" />
        <span className="text-sm text-gray-500">{unit}</span>
        <span className="ml-2 text-xs text-gray-400">
          (Global default: {defaultValue})
        </span>
      </div>
    </div>
  );
}
