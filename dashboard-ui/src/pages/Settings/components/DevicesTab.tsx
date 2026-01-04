import { Plus } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import React, { useState } from 'react';

import type { SettingsDevice } from '../types/settings.types';
import { DeviceFormModal } from './DeviceFormModal';

interface Props {
  devices: SettingsDevice[];
  onAddDevice: (device: SettingsDevice) => void;
}

export function DevicesTab({ devices, onAddDevice }: Props) {
  const [open, setOpen] = useState(false);

  function getDeviceStatus(
    device: SettingsDevice
  ): 'active' | 'deactive' {
    return device.assignedTo ? 'active' : 'deactive';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900">Device Management</h3>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register Device
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Device</th>
              <th className="px-4 py-3 text-left text-xs">Model</th>
              <th className="px-4 py-3 text-left text-xs">Battery</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Assigned</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {devices.map(d => {
              const status = getDeviceStatus(d);

              return (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{d.deviceId}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {d.model}
                  </td>
                  <td className="px-4 py-3">{d.battery}%</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {status}
                    </Badge>
                  </td>

                  {/* Assigned */}
                  <td className="px-4 py-3 text-gray-600">
                    {d.assignedTo ?? 'Unassigned'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <DeviceFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={onAddDevice}
      />
    </div>
  );
}
