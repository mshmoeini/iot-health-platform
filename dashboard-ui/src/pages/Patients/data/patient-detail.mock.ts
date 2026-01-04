import type { Patient } from '../types/patient.types';
import type { Vitals } from '../types/vitals.types';
import type { HistoryPoint, HistoryStats } from '../types/history.types';
import type { PatientAlert } from '../types/alert.types';
import type { NotificationSettings } from '../types/notification.types';

export function patientDetailMock(patientId: string) {
  const vitals: Vitals = {
    heartRate: 72,
    spo2: 98,
    temperature: 36.8,
    activityLevel: 'Resting',
    batteryLevel: 85,
    heartRateHistory: [],
  };

  const patient: Patient = {
    id: patientId,
    name: 'Sarah Johnson',
    age: 62,
    gender: 'female',
    photoUrl: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00',
    deviceId: 'WB-2047',
    deviceStatus: 'active',
    heartRate: vitals.heartRate,
    spo2: vitals.spo2,
    temperature: vitals.temperature,

    healthStatus: 'Normal',
    hasNewAlert: false,
    lastUpdate: 'Just now',
  };

  const historyData: HistoryPoint[] = Array.from({ length: 30 }, (_, i) => ({
    time: `${i + 1}`,
    heartRate: Math.floor(Math.random() * 30) + 65,
    spo2: Math.floor(Math.random() * 6) + 94,
    temperature: Number((Math.random() * 1.5 + 36.5).toFixed(1)),
  }));

  const historyStats: HistoryStats = {
    avgHeartRate: Math.round(
      historyData.reduce((a, b) => a + b.heartRate, 0) / historyData.length
    ),
    minHeartRate: Math.min(...historyData.map(h => h.heartRate)),
    maxHeartRate: Math.max(...historyData.map(h => h.heartRate)),
    avgSpo2: Math.round(
      historyData.reduce((a, b) => a + b.spo2, 0) / historyData.length
    ),
    alertsTriggered: 7,
  };

  const alerts: PatientAlert[] = [
    {
      id: '1',
      severity: 'warning',
      title: 'Elevated Heart Rate',
      description: 'Heart rate exceeded threshold',
      timestamp: '2 min ago',
      acknowledged: false,
    },
  ];

  const notifications: NotificationSettings = {
    caregiverName: 'Dr. Emily Roberts',
    caregiverPhone: '+1-555-0199',
    emergencyContactName: 'John Johnson',
    emergencyContactPhone: '+1-555-0102',

    smsAlertsEnabled: true,
    emergencyEscalationEnabled: true,
    preferredMethod: 'sms',

    lastNotificationSent: '2 hours ago',
    lastNotificationStatus: 'Delivered',

    customHeartRateThreshold: 110,
    customSpo2Threshold: 92,
    customTempThreshold: 38,

    notifyOnDisconnect: true,
    notifyOnLowBattery: true,
  };

  return {
    patient,
    vitals,
    history: {
      data: historyData,
      stats: historyStats,
    },
    alerts,
    notifications,
  };
}
