import { useState } from 'react';
import { Search, Filter, X, ChevronRight, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  fullDescription: string;
  patientName: string;
  patientPhoto: string;
  deviceId: string;
  timestamp: string;
  timestampDate: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  vitalsSnapshot?: {
    heartRate: number;
    spo2: number;
    temperature: number;
  };
  similarAlertsCount?: number;
}

interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning';
  alertType: string;
  description: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsPageProps {
  alerts: SystemAlert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPage({ alerts: systemAlerts, onAcknowledge }: AlertsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<'1h' | '24h' | '7d'>('24h');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Convert system alerts to full alert format and add mock data
  const allAlerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'Critical SpO₂ Level',
      description: 'SpO₂ dropped below 90% - immediate attention required',
      fullDescription: 'Patient SpO₂ level has dropped to 88%, which is below the critical threshold of 90%. This requires immediate medical attention. The patient may be experiencing respiratory distress.',
      patientName: 'Robert Mitchell',
      patientPhoto: 'https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-1823',
      timestamp: 'Just now',
      timestampDate: new Date(),
      status: 'new',
      vitalsSnapshot: {
        heartRate: 105,
        spo2: 88,
        temperature: 37.9,
      },
      similarAlertsCount: 3,
    },
    {
      id: '2',
      severity: 'critical',
      title: 'Irregular Heart Rate',
      description: 'Heart rate exceeded 110 bpm for extended period',
      fullDescription: 'Heart rate has been consistently above 110 bpm for the past 15 minutes. Patient may be experiencing tachycardia or stress response.',
      patientName: 'Margaret Williams',
      patientPhoto: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMG1lZGljYWx8ZW58MXx8fHwxNzY1NTU1MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-3156',
      timestamp: '2 min ago',
      timestampDate: new Date(Date.now() - 2 * 60000),
      status: 'new',
      vitalsSnapshot: {
        heartRate: 112,
        spo2: 94,
        temperature: 37.2,
      },
      similarAlertsCount: 1,
    },
    {
      id: '3',
      severity: 'warning',
      title: 'Elevated Temperature',
      description: 'Body temperature above 37.5°C',
      fullDescription: 'Patient body temperature has risen to 37.8°C. Monitor for signs of fever or infection. Consider checking temperature again in 30 minutes.',
      patientName: 'Sarah Johnson',
      patientPhoto: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwcG9ydHJhaXQlMjBtZWRpY2FsfGVufDF8fHx8MTc2NTU1Mjc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-2047',
      timestamp: '5 min ago',
      timestampDate: new Date(Date.now() - 5 * 60000),
      status: 'acknowledged',
      vitalsSnapshot: {
        heartRate: 78,
        spo2: 97,
        temperature: 37.8,
      },
      similarAlertsCount: 0,
    },
    {
      id: '4',
      severity: 'warning',
      title: 'Low Battery Warning',
      description: 'Wristband battery below 20%',
      fullDescription: 'The monitoring device battery level has dropped below 20%. Please arrange for device charging or replacement to ensure continuous monitoring.',
      patientName: 'James Anderson',
      patientPhoto: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGF0aWVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-4521',
      timestamp: '12 min ago',
      timestampDate: new Date(Date.now() - 12 * 60000),
      status: 'acknowledged',
    },
    {
      id: '5',
      severity: 'info',
      title: 'Device Reconnected',
      description: 'Connection restored to monitoring device',
      fullDescription: 'The monitoring device has successfully reconnected to the system after a brief disconnection. All vital signs are now being monitored normally.',
      patientName: 'Patricia Davis',
      patientPhoto: 'https://images.unsplash.com/photo-1643717347866-f213892b736b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU0Njg1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-5678',
      timestamp: '18 min ago',
      timestampDate: new Date(Date.now() - 18 * 60000),
      status: 'resolved',
    },
    {
      id: '6',
      severity: 'warning',
      title: 'SpO₂ Below Threshold',
      description: 'SpO₂ dropped to 93% - monitoring required',
      fullDescription: 'Patient SpO₂ level has decreased to 93%. While not critical, this is below the normal range and requires monitoring.',
      patientName: 'Michael Brown',
      patientPhoto: 'https://images.unsplash.com/photo-1758691461884-ff702418afde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGF0aWVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTU1NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      deviceId: 'WB-6789',
      timestamp: '25 min ago',
      timestampDate: new Date(Date.now() - 25 * 60000),
      status: 'acknowledged',
      vitalsSnapshot: {
        heartRate: 88,
        spo2: 93,
        temperature: 36.9,
      },
    },
  ];

  const severityConfig = {
    critical: { color: 'bg-red-100 text-red-800', icon: '🔴', label: 'Critical' },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: '🟡', label: 'Warning' },
    info: { color: 'bg-blue-100 text-blue-800', icon: '🔵', label: 'Info' },
  };

  const statusConfig = {
    new: { color: 'bg-red-100 text-red-800', label: 'New' },
    acknowledged: { color: 'bg-yellow-100 text-yellow-800', label: 'Acknowledged' },
    resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' },
  };

  // Filter alerts
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: allAlerts.length,
    active: allAlerts.filter(a => a.status !== 'resolved').length,
    critical: allAlerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
    warnings: allAlerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length,
  };

  const handleAcknowledge = (alertId: string) => {
    console.log('Acknowledge alert:', alertId);
  };

  const handleResolve = (alertId: string) => {
    console.log('Resolve alert:', alertId);
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Alerts</h2>
        <p className="text-gray-600">System-wide notifications from Risk Analysis Service</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts Today</p>
              <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Alerts</p>
              <p className="text-2xl text-gray-900 mt-1">{stats.active}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl text-red-600 mt-1">{stats.critical}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🔴</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Warnings</p>
              <p className="text-2xl text-yellow-600 mt-1">{stats.warnings}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🟡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by patient, device ID, or alert type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                severityFilter === 'all' ? 'bg-[#3A7AFE] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                severityFilter === 'critical' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                severityFilter === 'warning' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => setSeverityFilter('info')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                severityFilter === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Info
            </button>
          </div>

          {/* Time Range Filter */}
          <select
            value={timeRangeFilter}
            onChange={(e) => setTimeRangeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredAlerts.length}</span> alerts
        </p>
      </div>

      {/* Main Content Area */}
      <div className={`grid ${selectedAlert ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {/* Alerts List */}
        <div className={selectedAlert ? 'lg:col-span-2' : ''}>
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-600">No alerts match the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${
                    selectedAlert?.id === alert.id ? 'border-[#3A7AFE] ring-2 ring-[#3A7AFE] ring-opacity-20' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Patient Photo */}
                    <img
                      src={alert.patientPhoto}
                      alt={alert.patientName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={severityConfig[alert.severity].color}>
                            {severityConfig[alert.severity].icon} {severityConfig[alert.severity].label}
                          </Badge>
                          <Badge className={statusConfig[alert.status].color}>
                            {statusConfig[alert.status].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </div>
                      </div>

                      <h3 className="text-gray-900 mb-1">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{alert.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="font-medium text-gray-700">{alert.patientName}</span>
                        <span>Device: {alert.deviceId}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="text-sm text-[#3A7AFE] hover:underline flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alert Details Sidebar */}
        {selectedAlert && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Alert Details</h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Patient Summary */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <img
                  src={selectedAlert.patientPhoto}
                  alt={selectedAlert.patientName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <div className="text-gray-900">{selectedAlert.patientName}</div>
                  <div className="text-sm text-gray-500">Device: {selectedAlert.deviceId}</div>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 mb-2">Description</h4>
                <p className="text-sm text-gray-700">{selectedAlert.fullDescription}</p>
              </div>

              {/* Vitals Snapshot */}
              {selectedAlert.vitalsSnapshot && (
                <div className="mb-4">
                  <h4 className="text-sm text-gray-500 mb-3">Vitals at Alert Time</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Heart Rate</span>
                      <span className="font-medium text-gray-900">{selectedAlert.vitalsSnapshot.heartRate} bpm</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">SpO₂</span>
                      <span className="font-medium text-gray-900">{selectedAlert.vitalsSnapshot.spo2}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-medium text-gray-900">{selectedAlert.vitalsSnapshot.temperature}°C</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Similar Alerts */}
              {selectedAlert.similarAlertsCount !== undefined && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>{selectedAlert.similarAlertsCount}</strong> similar alert{selectedAlert.similarAlertsCount !== 1 ? 's' : ''} in the past 24 hours
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {selectedAlert.status !== 'resolved' && (
                  <Button
                    onClick={() => handleResolve(selectedAlert.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  View Patient Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}