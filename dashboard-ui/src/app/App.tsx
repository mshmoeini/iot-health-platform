import { useState, useEffect } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { Sidebar } from './components/Sidebar';
import { SystemOverview } from './components/SystemOverview';
import { AggregatedMetrics } from './components/AggregatedMetrics';
import { SystemMonitoringCharts } from './components/SystemMonitoringCharts';
import { SystemAlertsPanel } from './components/SystemAlertsPanel';
import { PatientsListPage } from './components/PatientsListPage';
import { PatientDetailPage } from './components/PatientDetailPage';
import { AlertsPage } from './components/AlertsPage';
import { SettingsPage } from './components/SettingsPage';

interface SystemAlert {
  id: string;
  severity: 'critical' | 'warning';
  alertType: string;
  description: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const [systemStatus, setSystemStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [activeDevices] = useState(24);
  const [patientsMonitored] = useState(24);
  const [lastUpdate, setLastUpdate] = useState('Just now');

  // Aggregated metrics
  const [metrics, setMetrics] = useState({
    avgHeartRate: 74,
    avgSpo2: 97,
    patientsInRisk: 2,
    lowBatteryDevices: 3,
  });

  // System-wide alerts
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      severity: 'warning' as const,
      alertType: 'Elevated Heart Rate',
      description: 'Heart rate exceeded threshold',
      deviceId: 'WB-2047',
      timestamp: '2 min ago',
      acknowledged: false,
    },
    {
      id: '2',
      severity: 'critical' as const,
      alertType: 'Low SpO₂ Level',
      description: 'SpO₂ dropped below 90%',
      deviceId: 'WB-1823',
      timestamp: '5 min ago',
      acknowledged: false,
    },
    {
      id: '3',
      severity: 'warning' as const,
      alertType: 'Low Battery',
      description: 'Battery level below 20%',
      deviceId: 'WB-3156',
      timestamp: '8 min ago',
      acknowledged: false,
    },
  ]);

  // Real-time chart data
  const [alertsTrendData, setAlertsTrendData] = useState<{ time: string; alerts: number }[]>([]);
  const [vitalsTrendData, setVitalsTrendData] = useState<{ time: string; avgHeartRate: number; avgSpo2: number }[]>([]);

  // Simulate real-time system updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Update last update timestamp
      setLastUpdate('Just now');

      // Update aggregated metrics with slight variations
      setMetrics(prev => ({
        avgHeartRate: Math.floor(Math.random() * 10) + 70,
        avgSpo2: Math.floor(Math.random() * 4) + 95,
        patientsInRisk: Math.random() > 0.7 ? prev.patientsInRisk : Math.floor(Math.random() * 4),
        lowBatteryDevices: Math.random() > 0.9 ? Math.min(prev.lowBatteryDevices + 1, 5) : prev.lowBatteryDevices,
      }));

      // Update alerts trend
      const newAlertsCount = Math.floor(Math.random() * 5);
      setAlertsTrendData(prev => {
        const newData = [...prev, { time: timeStr, alerts: newAlertsCount }];
        return newData.slice(-30);
      });

      // Update vitals trend
      const newAvgHR = Math.floor(Math.random() * 20) + 65;
      const newAvgSpo2 = Math.floor(Math.random() * 8) + 92;
      setVitalsTrendData(prev => {
        const newData = [...prev, { time: timeStr, avgHeartRate: newAvgHR, avgSpo2: newAvgSpo2 }];
        return newData.slice(-30);
      });

      // Randomly generate new system alerts
      if (Math.random() > 0.92) {
        const alertTypes = [
          {
            severity: 'critical' as const,
            alertType: 'Critical SpO₂',
            description: 'SpO₂ level critically low',
          },
          {
            severity: 'warning' as const,
            alertType: 'Irregular Heart Rate',
            description: 'Heart rate variability detected',
          },
          {
            severity: 'warning' as const,
            alertType: 'Device Disconnected',
            description: 'Lost connection to wristband',
          },
          {
            severity: 'critical' as const,
            alertType: 'High Temperature',
            description: 'Body temperature above 38°C',
          },
        ];

        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const randomDeviceId = `WB-${Math.floor(Math.random() * 9000) + 1000}`;
        
        const newAlert: SystemAlert = {
          id: Date.now().toString(),
          ...randomAlert,
          deviceId: randomDeviceId,
          timestamp: 'Just now',
          acknowledged: false,
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 15));
      }

      // Update system status based on active alerts
      const activeAlerts = alerts.filter(a => !a.acknowledged);
      const hasCritical = activeAlerts.some(a => a.severity === 'critical');
      const hasWarning = activeAlerts.some(a => a.severity === 'warning');

      if (hasCritical) {
        setSystemStatus('critical');
      } else if (hasWarning || metrics.patientsInRisk > 3) {
        setSystemStatus('warning');
      } else {
        setSystemStatus('normal');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [alerts, metrics.patientsInRisk]);

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedPatientId(null);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleBackToPatientList = () => {
    setSelectedPatientId(null);
  };

  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <NavigationBar systemStatus={systemStatus} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem={currentPage} onNavigate={handleNavigate} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto">
            {/* Dashboard Page */}
            {currentPage === 'Dashboard' && (
              <div className="space-y-6">
                <SystemOverview
                  systemStatus={systemStatus}
                  activeDevices={activeDevices}
                  patientsMonitored={patientsMonitored}
                  activeAlerts={activeAlertsCount}
                  lastUpdate={lastUpdate}
                />

                <AggregatedMetrics metrics={metrics} />

                <SystemMonitoringCharts
                  alertsTrendData={alertsTrendData}
                  vitalsTrendData={vitalsTrendData}
                />

                <SystemAlertsPanel
                  alerts={alerts}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              </div>
            )}

            {/* Patients Page */}
            {currentPage === 'Patients' && !selectedPatientId && (
              <PatientsListPage onSelectPatient={handleSelectPatient} />
            )}

            {/* Patient Detail Page */}
            {currentPage === 'Patients' && selectedPatientId && (
              <PatientDetailPage
                patientId={selectedPatientId}
                onBack={handleBackToPatientList}
              />
            )}

            {/* Alerts Page */}
            {currentPage === 'Alerts' && (
              <AlertsPage alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            )}

            {/* Settings Page */}
            {currentPage === 'Settings' && (
              <SettingsPage />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}