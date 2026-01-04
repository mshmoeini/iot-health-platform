import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Button } from '../../app/components/ui/button';
import { useState } from 'react';

import { usePatientsList } from './hook/usePatientsList';
import { PatientCard } from './components/PatientCard';

export default function PatientsListPage() {
  const navigate = useNavigate();

  const {
    patients,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = usePatientsList();

  const [sortBy, setSortBy] = useState<'az' | 'za'>('az');

  const sortedPatients = [...patients].sort((a, b) =>
    sortBy === 'az'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading patients…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Patients</h2>
        <p className="text-gray-600">
          Monitor all patients and their vital signs
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl border space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by name or device ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(['All', 'Normal', 'Warning', 'Critical'] as const).map(s => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? 'default' : 'outline'}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'az' | 'za')}
          >
            <option value="az">Sort: A–Z</option>
            <option value="za">Sort: Z–A</option>
          </select>
        </div>

        <p className="text-sm text-gray-500">
          Showing {sortedPatients.length} patients
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedPatients.map(p => (
          <PatientCard
            key={p.id}
            patient={p}
            onClick={() => navigate(`/patients/${p.id}`)}
          />
        ))}
      </div>

      {/* Pagination (mock) */}
      <div className="flex justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
