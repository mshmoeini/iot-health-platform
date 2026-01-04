import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import { PatientFormModal } from './PatientFormModal';
import type { SettingsPatient,SettingsDevice } from '../types/settings.types';
import { useState } from 'react';

interface Props {
  patients: SettingsPatient[];
  devices: SettingsDevice[];        // 👈 اضافه
  onSavePatient: (patient: SettingsPatient) => void;
  onDeletePatient?: (id: string) => void;
}

export function PatientsTab({
  patients,
  onSavePatient,
  onDeletePatient,
  devices
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [editPatient, setEditPatient] =
    useState<SettingsPatient | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900">Patient Management</h3>

        <Button
          onClick={() => {
            setEditPatient(null);
            setOpenModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs">Name</th>
              <th className="px-4 py-3 text-left text-xs">Patient ID</th>
              <th className="px-4 py-3 text-left text-xs">Phone</th>
              <th className="px-4 py-3 text-left text-xs">Device</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.patientId}</td>
                <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                <td className="px-4 py-3 text-gray-600">
                  {p.assignedDevice || '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      p.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Edit2
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                    onClick={() => {
                      setEditPatient(p);
                      setOpenModal(true);
                    }}
                  />

                  <Trash2
                    className="w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() => {
                      if (!onDeletePatient) return;
                      if (confirm(`Delete patient "${p.name}"?`)) {
                        onDeletePatient(p.id);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <PatientFormModal
        open={openModal}
        mode={editPatient ? 'edit' : 'create'}
        devices={devices}
        initialData={editPatient ?? null}
        onClose={() => setOpenModal(false)}
        onSave={onSavePatient}
      />
    </div>
  );
}
