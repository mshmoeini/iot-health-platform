import { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Heart, Droplet, Thermometer, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  deviceId: string;
  healthStatus: 'Normal' | 'Warning' | 'Critical';
  lastUpdate: string;
  photoUrl: string;
  vitals: {
    heartRate: number;
    spo2: number;
    temperature: number;
  };
  ward: string;
  hasNewAlert: boolean;
}

interface PatientsListPageProps {
  onSelectPatient: (patientId: string) => void;
}

export function PatientsListPage({ onSelectPatient }: PatientsListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Normal' | 'Warning' | 'Critical'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'updated'>('name');

  // Mock patient data
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 62,
      gender: 'Female',
      deviceId: 'WB-2047',
      healthStatus: 'Normal',
      lastUpdate: '2 min ago',
      photoUrl: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwcG9ydHJhaXQlMjBtZWRpY2FsfGVufDF8fHx8MTc2NTU1Mjc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 72, spo2: 98, temperature: 36.8 },
      ward: 'ICU-A',
      hasNewAlert: false,
    },
    {
      id: '2',
      name: 'Robert Mitchell',
      age: 58,
      gender: 'Male',
      deviceId: 'WB-1823',
      healthStatus: 'Critical',
      lastUpdate: 'Just now',
      photoUrl: 'https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 105, spo2: 89, temperature: 37.9 },
      ward: 'ICU-A',
      hasNewAlert: true,
    },
    {
      id: '3',
      name: 'Margaret Williams',
      age: 71,
      gender: 'Female',
      deviceId: 'WB-3156',
      healthStatus: 'Warning',
      lastUpdate: '5 min ago',
      photoUrl: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMG1lZGljYWx8ZW58MXx8fHwxNzY1NTU1MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 92, spo2: 94, temperature: 37.2 },
      ward: 'Ward-2B',
      hasNewAlert: true,
    },
    {
      id: '4',
      name: 'James Anderson',
      age: 65,
      gender: 'Male',
      deviceId: 'WB-4521',
      healthStatus: 'Normal',
      lastUpdate: '1 min ago',
      photoUrl: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGF0aWVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 68, spo2: 97, temperature: 36.6 },
      ward: 'Ward-3A',
      hasNewAlert: false,
    },
    {
      id: '5',
      name: 'Patricia Davis',
      age: 59,
      gender: 'Female',
      deviceId: 'WB-5678',
      healthStatus: 'Normal',
      lastUpdate: '3 min ago',
      photoUrl: 'https://images.unsplash.com/photo-1643717347866-f213892b736b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU0Njg1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 75, spo2: 98, temperature: 36.9 },
      ward: 'Ward-2B',
      hasNewAlert: false,
    },
    {
      id: '6',
      name: 'Michael Brown',
      age: 68,
      gender: 'Male',
      deviceId: 'WB-6789',
      healthStatus: 'Warning',
      lastUpdate: '4 min ago',
      photoUrl: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGF0aWVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: { heartRate: 95, spo2: 93, temperature: 37.4 },
      ward: 'ICU-B',
      hasNewAlert: false,
    },
  ];

  const statusBadgeStyles = {
    Normal: 'bg-green-100 text-green-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
  };

  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || patient.healthStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') {
        const statusOrder = { Critical: 0, Warning: 1, Normal: 2 };
        return statusOrder[a.healthStatus] - statusOrder[b.healthStatus];
      }
      return 0; // For 'updated' we'd need actual timestamps
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Patients</h2>
        <p className="text-gray-600">Monitor all patients and their vital signs</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or device ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['All', 'Normal', 'Warning', 'Critical'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-[#3A7AFE] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="name">Sort: A-Z</option>
              <option value="status">Sort: Status</option>
              <option value="updated">Sort: Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredPatients.length}</span> patients
        </p>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-[#3A7AFE] text-left group"
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Patient Photo */}
              <div className="relative">
                <img
                  src={patient.photoUrl}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                {patient.hasNewAlert && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-gray-900 truncate group-hover:text-[#3A7AFE] transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#3A7AFE] transition-colors shrink-0" />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusBadgeStyles[patient.healthStatus]}>
                    {patient.healthStatus}
                  </Badge>
                  {patient.hasNewAlert && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      New Alert
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Device Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
              <span>Device: {patient.deviceId}</span>
              <span>{patient.lastUpdate}</span>
            </div>

            {/* Mini Vitals */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">HR</span>
                </div>
                <div className={`text-sm ${
                  patient.vitals.heartRate > 100 ? 'text-red-600' :
                  patient.vitals.heartRate > 90 ? 'text-yellow-600' :
                  'text-gray-900'
                }`}>
                  {patient.vitals.heartRate} <span className="text-xs text-gray-500">bpm</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Droplet className="w-3 h-3" />
                  <span className="text-xs">SpO₂</span>
                </div>
                <div className={`text-sm ${
                  patient.vitals.spo2 < 90 ? 'text-red-600' :
                  patient.vitals.spo2 < 95 ? 'text-yellow-600' :
                  'text-gray-900'
                }`}>
                  {patient.vitals.spo2} <span className="text-xs text-gray-500">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <Thermometer className="w-3 h-3" />
                  <span className="text-xs">Temp</span>
                </div>
                <div className={`text-sm ${
                  patient.vitals.temperature >= 38 ? 'text-red-600' :
                  patient.vitals.temperature >= 37.5 ? 'text-yellow-600' :
                  'text-gray-900'
                }`}>
                  {patient.vitals.temperature} <span className="text-xs text-gray-500">°C</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded bg-[#3A7AFE] text-white text-sm">1</button>
          <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200">2</button>
          <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200">3</button>
        </div>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
