import { useEffect, useState } from 'react';
import { getPatients } from '../repositories/patients.repository';
import type { Patient } from '../types/patient.types';

export function usePatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'All' | 'Normal' | 'Warning' | 'Critical'>('All');

  const [sortBy, setSortBy] = useState<'az' | 'za'>('az');

  useEffect(() => {
    setLoading(true);

    getPatients({
      search: searchQuery,
      status: statusFilter,
      sort: sortBy,
    }).then(res => {
      setPatients(res);
      setLoading(false);
    });
  }, [searchQuery, statusFilter, sortBy]);

  return {
    patients,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  };
}
