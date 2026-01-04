import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { useState, useEffect } from 'react';
import type { SettingsDevice } from '../types/settings.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (device: SettingsDevice) => void;
}

type DeviceFormData = Pick<SettingsDevice, 'id' | 'deviceId' | 'model'>;

export function DeviceFormModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<DeviceFormData>({
    id: crypto.randomUUID(),
    deviceId: '',
    model: '',
  });

  // reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({
        id: crypto.randomUUID(),
        deviceId: '',
        model: '',
      });
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit() {
    const payload: SettingsDevice = {
      ...form,
      battery: 100,        // default battery
      assignedTo: null,    // unassigned by default
    };

    console.log('📤 ADD DEVICE PAYLOAD:', payload);
    onSave(payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Register Device</h3>

        <Input
          placeholder="Device ID (WB-1234)"
          value={form.deviceId}
          onChange={e =>
            setForm(prev => ({ ...prev, deviceId: e.target.value }))
          }
        />

        <Input
          placeholder="Model"
          value={form.model}
          onChange={e =>
            setForm(prev => ({ ...prev, model: e.target.value }))
          }
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
