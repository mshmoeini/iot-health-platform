import { Badge } from '../../../app/components/ui/badge';
import { Button } from '../../../app/components/ui/button';
import type { SettingsDevice, DeviceAssignment } from '../types/settings.types';

interface Props {
  devices: SettingsDevice[];
  assignments: DeviceAssignment[];
  onUnassign: (patientId: string) => void;
}

export function AssignmentsTab({
  devices,
  assignments,
  onUnassign,
}: Props) {
  function getDeviceModel(deviceId: string) {
    return devices.find(d => d.deviceId === deviceId)?.model ?? '-';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-gray-900">Device Assignments</h3>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Device</th>
              <th className="px-4 py-3 text-left text-xs">Model</th>
              <th className="px-4 py-3 text-left text-xs">Patient</th>
              <th className="px-4 py-3 text-left text-xs">Assigned Date</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {assignments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No device assignments yet
                </td>
              </tr>
            )}

            {assignments.map(a => (
              <tr key={a.id}>
                <td className="px-4 py-3">{a.deviceId}</td>

                <td className="px-4 py-3 text-gray-600">
                  {getDeviceModel(a.deviceId)}
                </td>

                <td className="px-4 py-3">{a.patientName}</td>

                <td className="px-4 py-3 text-gray-500">
                  {a.dateAssigned}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {a.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      Inactive
                    </Badge>
                  )}
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  {a.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnassign(a.patientId)}
                    >
                      Unassign
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
