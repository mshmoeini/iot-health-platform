import { useState } from 'react';
import { Users, Wifi, Link, Bell, Settings as SettingsIcon, Plus, Edit2, Trash2, Check, X, Send, Database, Save, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type SettingsTab = 'patients' | 'devices' | 'assignments' | 'notifications' | 'system';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientId: string;
  phone: string;
  assignedDevice: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
  notes?: string;
}

interface Device {
  id: string;
  deviceId: string;
  model: string;
  status: 'online' | 'offline';
  battery: number;
  assignedTo: string | null;
  lastSeen: string;
  serialNumber: string;
  firmwareVersion: string;
}

interface Assignment {
  id: string;
  patientName: string;
  deviceId: string;
  dateAssigned: string;
  status: 'active' | 'inactive';
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('patients');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [assignmentSearch, setAssignmentSearch] = useState('');

  // Mock data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 62,
      gender: 'Female',
      patientId: 'PT-001',
      phone: '+1-555-0101',
      assignedDevice: 'WB-2047',
      status: 'active',
      emergencyContact: '+1-555-0102',
    },
    {
      id: '2',
      name: 'Robert Mitchell',
      age: 58,
      gender: 'Male',
      patientId: 'PT-002',
      phone: '+1-555-0201',
      assignedDevice: 'WB-1823',
      status: 'active',
    },
    {
      id: '3',
      name: 'Margaret Williams',
      age: 71,
      gender: 'Female',
      patientId: 'PT-003',
      phone: '+1-555-0301',
      assignedDevice: 'WB-3156',
      status: 'active',
    },
  ]);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      deviceId: 'WB-2047',
      model: 'HealthBand Pro',
      status: 'online',
      battery: 85,
      assignedTo: 'Sarah Johnson',
      lastSeen: '2 min ago',
      serialNumber: 'HBP-2047-X1',
      firmwareVersion: '2.1.4',
    },
    {
      id: '2',
      deviceId: 'WB-1823',
      model: 'HealthBand Pro',
      status: 'online',
      battery: 92,
      assignedTo: 'Robert Mitchell',
      lastSeen: 'Just now',
      serialNumber: 'HBP-1823-X1',
      firmwareVersion: '2.1.4',
    },
    {
      id: '3',
      deviceId: 'WB-5621',
      model: 'HealthBand Lite',
      status: 'offline',
      battery: 45,
      assignedTo: null,
      lastSeen: '2 hours ago',
      serialNumber: 'HBL-5621-L2',
      firmwareVersion: '1.8.2',
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      deviceId: 'WB-2047',
      dateAssigned: '2024-11-15',
      status: 'active',
    },
    {
      id: '2',
      patientName: 'Robert Mitchell',
      deviceId: 'WB-1823',
      dateAssigned: '2024-11-20',
      status: 'active',
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    smsEnabled: true,
    emergencyEscalation: true,
    emailEnabled: false,
    smsSender: '+1-555-HEALTH',
    systemEmail: 'alerts@healthmonitor.com',
    spo2Threshold: 90,
    hrThreshold: 120,
    batteryThreshold: 20,
    disconnectAlert: true,
  });

  const tabs = [
    { id: 'patients' as SettingsTab, label: 'Patient Management', icon: Users },
    { id: 'devices' as SettingsTab, label: 'Device Management', icon: Wifi },
    { id: 'assignments' as SettingsTab, label: 'Device Assignment', icon: Link },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'system' as SettingsTab, label: 'System Config', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage patients, devices, and system configuration</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-2 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#3A7AFE] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Patient Management Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">Manage Patients</h3>
                <Button
                  onClick={() => setShowAddPatientForm(!showAddPatientForm)}
                  className="bg-[#3A7AFE] hover:bg-[#2d5fcf]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
              </div>

              {showAddPatientForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-gray-900">Add New Patient</h4>
                    <button
                      onClick={() => setShowAddPatientForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Full Name *</label>
                      <Input placeholder="Enter patient name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Age *</label>
                      <Input type="number" placeholder="Age" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Gender *</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Patient ID</label>
                      <Input placeholder="Auto-generated" disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Phone Number *</label>
                      <Input placeholder="+1-555-0000" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Emergency Contact</label>
                      <Input placeholder="+1-555-0000" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Medical Conditions / Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        rows={3}
                        placeholder="Enter any relevant medical information..."
                      />
                    </div>
                  </div>

                  {/* Device Assignment Section */}
                  <div className="mt-6 pt-6 border-t border-blue-300">
                    <h5 className="text-gray-900 mb-3 flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-[#3A7AFE]" />
                      Assign Device (Optional)
                    </h5>
                    <p className="text-xs text-gray-600 mb-3">Device will be automatically assigned to this patient upon saving.</p>
                    
                    {devices.filter(d => !d.assignedTo).length > 0 ? (
                      <>
                        <div className="mb-3">
                          <label className="block text-sm text-gray-700 mb-1">Select Device</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                          >
                            <option value="">-- No Device (Assign Later) --</option>
                            {devices.filter(d => !d.assignedTo).map(d => (
                              <option key={d.id} value={d.id}>
                                {d.deviceId} - {d.model}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedDevice && (() => {
                          const device = devices.find(d => d.id === selectedDevice);
                          return device ? (
                            <div className="bg-white border border-blue-200 rounded-lg p-3">
                              <div className="text-sm text-gray-700 mb-2">Device Preview:</div>
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-600">Status:</span>
                                  <Badge className={`ml-1 ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {device.status}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-gray-600">Battery:</span>
                                  <span className="ml-1 text-gray-900">{device.battery}%</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Last Seen:</span>
                                  <span className="ml-1 text-gray-900">{device.lastSeen}</span>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                        No available devices. Please register a new device first.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Patient {selectedDevice && '& Assign Device'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPatientForm(false)}>
                      Cancel
                    </Button>
                  </div>

                  {selectedDevice && (
                    <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded-lg flex items-start gap-2 text-xs text-blue-800">
                      <Check className="w-3 h-3 mt-0.5" />
                      <span>Selected device will be assigned automatically when you save this patient.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Patient List Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Patient Name</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Age / Gender</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Patient ID</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Assigned Device</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Phone Number</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{patient.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.age} / {patient.gender}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.patientId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.assignedDevice}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                        <td className="px-4 py-3">
                          <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Device Management Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">Manage Devices</h3>
                <Button
                  onClick={() => setShowAddDeviceForm(!showAddDeviceForm)}
                  className="bg-[#3A7AFE] hover:bg-[#2d5fcf]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register New Device
                </Button>
              </div>

              {showAddDeviceForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-gray-900">Register New Device</h4>
                    <button
                      onClick={() => setShowAddDeviceForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Device ID *</label>
                      <Input placeholder="WB-XXXX" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Device Type *</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Wristband</option>
                        <option>Chest Strap</option>
                        <option>Smart Patch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Serial Number *</label>
                      <Input placeholder="HBP-XXXX-XX" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Firmware Version</label>
                      <Input placeholder="2.1.4" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Notes</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        rows={2}
                        placeholder="Device notes..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Register Device
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddDeviceForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Device List Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Device ID</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Device Model</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Battery</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Assigned To</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Last Seen</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {devices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{device.deviceId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{device.model}</td>
                        <td className="px-4 py-3">
                          <Badge className={device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {device.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{device.battery}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${device.battery < 20 ? 'bg-red-500' : device.battery < 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${device.battery}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {device.assignedTo || <span className="text-gray-400">Unassigned</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{device.lastSeen}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-sm text-blue-600 hover:text-blue-800">Details</button>
                            <button className="text-sm text-orange-600 hover:text-orange-800">Reassign</button>
                            <button className="text-sm text-red-600 hover:text-red-800">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Device Assignment Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Device Assignment Management</h3>
                  <p className="text-sm text-gray-600 mt-1">View and manage existing device assignments. New assignments are created during patient creation.</p>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Assignment Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                      value={assignmentFilter}
                      onChange={(e) => setAssignmentFilter(e.target.value)}
                    >
                      <option value="all">All Assignments</option>
                      <option value="assigned">Assigned</option>
                      <option value="unassigned">Unassigned Devices</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Device Type</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option value="all">All Types</option>
                      <option value="wristband">Wristband</option>
                      <option value="chest">Chest Strap</option>
                      <option value="patch">Smart Patch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Battery Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option value="all">All Levels</option>
                      <option value="low">Low (&lt;20%)</option>
                      <option value="medium">Medium (20-50%)</option>
                      <option value="high">High (&gt;50%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Patient or Device ID"
                        className="pl-9"
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Device ID</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Device Model</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Patient</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Assigned Date</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Battery</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {devices.map((device) => {
                      const assignment = assignments.find(a => a.deviceId === device.deviceId);
                      return (
                        <tr key={device.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{device.deviceId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{device.model}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {device.assignedTo || <span className="text-gray-400">Unassigned</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {assignment?.dateAssigned || <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">{device.battery}%</span>
                              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${device.battery < 20 ? 'bg-red-500' : device.battery < 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                  style={{ width: `${device.battery}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {device.assignedTo ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600">Available</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {device.assignedTo ? (
                                <>
                                  <button className="text-sm text-orange-600 hover:text-orange-800">Reassign</button>
                                  <button className="text-sm text-red-600 hover:text-red-800">Unassign</button>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">No actions</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Assignment History Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm text-gray-900">Assignment Summary</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      {devices.filter(d => d.assignedTo).length} devices assigned • {devices.filter(d => !d.assignedTo).length} devices available
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {devices.filter(d => d.assignedTo && d.status === 'online').length} Online
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {devices.filter(d => d.assignedTo && d.status === 'offline').length} Offline
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-gray-900">System Notification Configuration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure system-level notification providers and API keys. Patient-specific notification settings are managed in each patient's detail page.
              </p>

              {/* Notification Provider Configuration */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-gray-900 mb-4">SMS Provider Configuration (Twilio)</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Twilio Account SID</label>
                      <Input defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" type="password" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Twilio Auth Token</label>
                      <Input defaultValue="••••••••••••••••••••••••••••••••" type="password" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Twilio Phone Number</label>
                      <Input defaultValue="+1-555-HEALTH" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">SMS Rate Limit</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>10 per minute</option>
                        <option>30 per minute</option>
                        <option>60 per minute</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>

                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Test SMS Provider Connection
                  </Button>
                </div>
              </div>

              {/* Email Provider Configuration */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-gray-900 mb-4">Email Provider Configuration (SMTP)</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">SMTP Host</label>
                      <Input defaultValue="smtp.gmail.com" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">SMTP Port</label>
                      <Input defaultValue="587" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">SMTP Username</label>
                      <Input defaultValue="alerts@healthmonitor.com" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">SMTP Password</label>
                      <Input defaultValue="••••••••••••••••" type="password" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">From Name</label>
                      <Input defaultValue="Health Monitor System" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">From Email</label>
                      <Input defaultValue="noreply@healthmonitor.com" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded-full bg-green-500 relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-5" />
                      </div>
                      <span className="text-sm text-gray-900">Use SSL/TLS Encryption</span>
                    </div>
                  </div>

                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Test Email Provider Connection
                  </Button>
                </div>
              </div>

              {/* Global Alert Thresholds (Defaults) */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-gray-900 mb-4">Global Alert Thresholds (Default Values)</h4>
                <p className="text-sm text-gray-600 mb-4">
                  These are default thresholds applied to all patients. Individual patients can override these in their settings.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Default Heart Rate Threshold</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="120" className="w-24" />
                        <span className="text-sm text-gray-500">bpm</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Default SpO₂ Threshold</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="90" className="w-24" />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Default Temperature Threshold</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" step="0.1" defaultValue="38.0" className="w-24" />
                        <span className="text-sm text-gray-500">°C</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Battery Low Threshold</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="20" className="w-24" />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save System Notification Configuration
              </Button>
            </div>
          )}

          {/* System Configuration Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-gray-900">System Configuration</h3>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-gray-900 mb-4">Connection Settings</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">MQTT Broker URL</label>
                    <Input defaultValue="mqtt://broker.hivemq.com:1883" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">REST API Base URL</label>
                    <Input defaultValue="https://api.healthmonitor.com/v1" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">WebSocket URL (Real-time)</label>
                    <Input defaultValue="wss://ws.healthmonitor.com" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-gray-900 mb-4">Data Management</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data Retention Policy</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded-full bg-green-500 relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-5" />
                      </div>
                      <span className="text-sm text-gray-900">Auto Device Cleanup (Remove inactive devices)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Database
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save System Configuration
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}