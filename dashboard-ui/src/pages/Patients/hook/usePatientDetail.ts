import { useEffect, useState } from 'react';
import { getPatientDetail } from '../repositories/patient-detail.repository';

import type { Patient } from '../types/patient.types';
import type { Vitals } from '../types/vitals.types';
import type { HistoryPoint, HistoryStats } from '../types/history.types';
import type { PatientAlert } from '../types/alert.types';
import type { NotificationSettings } from '../types/notification.types';

export function usePatientDetail(patientId?: string) {
  const [loading, setLoading] = useState(true);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [historyStats, setHistoryStats] = useState<HistoryStats | null>(null);
  const [alerts, setAlerts] = useState<PatientAlert[]>([]);
  const [notifications, setNotifications] =
    useState<NotificationSettings | null>(null);

  useEffect(() => {
    if (!patientId) return;

    setLoading(true);

    getPatientDetail(patientId).then(res => {
      setPatient(res.patient);
      setVitals(res.vitals);
      setHistoryData(res.history.data);
      setHistoryStats(res.history.stats);
      setAlerts(res.alerts);
      setNotifications(res.notifications);
      setLoading(false);
    });
  }, [patientId]);

  return {
    loading,
    patient,
    vitals,
    history: {
      data: historyData,
      stats: historyStats,
    },
    alerts,
    notifications,
    setNotifications,
  };
}
