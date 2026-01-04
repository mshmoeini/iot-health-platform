import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { usePatientForm } from '../hook/usePatientForm';

import type {
  SettingsPatient,
  SettingsDevice,
} from '../types/settings.types';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initialData: SettingsPatient | null;
  devices: SettingsDevice[];
  onClose: () => void;
  onSave: (patient: SettingsPatient) => void;
}

export function PatientFormModal({
  open,
  mode,
  initialData,
  devices,
  onClose,
  onSave,
}: Props) {
  const { form, errors, setField, submit } = usePatientForm({
    mode,
    initialData,
    onSave,
    onClose,
  });

  if (!open) return null;

  const availableDevices = devices.filter(
    d => !d.assignedTo || d.deviceId === form.assignedDevice
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">
          {mode === 'create' ? 'Add Patient' : 'Edit Patient'}
        </h3>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Full name</label>
          <Input
            value={form.name}
            onChange={e => setField('name', e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone number</label>
          <Input
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Patient ID */}
        <div>
          <label className="text-sm text-gray-600">Patient ID</label>
          <Input value={form.patientId} disabled />
        </div>

        {/* Device Assignment */}
        <div>
          <label className="text-sm text-gray-600">
            Assigned device (optional)
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.assignedDevice ?? ''}
            onChange={e =>
              setField('assignedDevice', e.target.value || null)
            }
          >
            <option value="">No device</option>
            {availableDevices.map(d => (
              <option key={d.id} value={d.deviceId}>
                {d.deviceId} — {d.model}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
