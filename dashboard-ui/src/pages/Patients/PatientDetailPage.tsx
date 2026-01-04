import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Button } from '../../app/components/ui/button';
import { usePatientDetail } from './hook/usePatientDetail';

import { PatientHeader } from './components/PatientHeader';
import { RealtimeVitals } from './components/vital/RealtimeVitals';
import { RealtimeVitalCharts } from './components/vital/RealtimeVitalCharts';
import { HistorySummary } from './components/history/HistorySummary';
import { HistoryCharts } from './components/history/HistoryCharts';
import { PatientAlerts } from './components/alert/PatientAlerts';
import { NotificationSettings } from './components/notifications/NotificationSettings';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    patient,
    vitals,
    history,
    alerts,
    notifications,
  } = usePatientDetail(id);

  const [tab, setTab] =
    useState<'vitals' | 'history' | 'alerts' | 'notifications'>('vitals');

  /* ---------------- Realtime chart buffers ---------------- */
  const [heartRateData, setHeartRateData] = useState<
    { time: string; value: number }[]
  >([]);
  const [spo2Data, setSpo2Data] = useState<
    { time: string; value: number }[]
  >([]);

  useEffect(() => {
    if (!vitals) return;

    const interval = setInterval(() => {
      const now = new Date();
      const time = `${now.getSeconds()}s`;

      setHeartRateData(prev =>
        [...prev, { time, value: vitals.heartRate }].slice(-30)
      );

      setSpo2Data(prev =>
        [...prev, { time, value: vitals.spo2 }].slice(-30)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [vitals]);

  /* ---------------- Loading guard ---------------- */
  if (loading || !patient || !vitals || !notifications) {
    return <div className="py-20 text-center">Loading patient...</div>;
  }
if (loading || !patient || !vitals || !notifications || !history.stats) {
  return <div className="py-20 text-center">Loading patient...</div>;
}
  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/patients')}>
        ← Back
      </Button>

      <PatientHeader patient={patient} />

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {(['vitals', 'history', 'alerts', 'notifications'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 capitalize transition ${
              tab === t
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Vitals */}
      {tab === 'vitals' && (
        <div className="space-y-6">
          <RealtimeVitals vitals={vitals} />
          <RealtimeVitalCharts
            heartRateData={heartRateData}
            spo2Data={spo2Data}
          />
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <>
          <HistorySummary stats={history.stats} />
          <HistoryCharts data={history.data} />
        </>
      )}

      {/* Alerts */}
      {tab === 'alerts' && <PatientAlerts alerts={alerts} />}

      {/* Notifications */}
      {tab === 'notifications' && (
        <NotificationSettings settings={notifications} />
      )}
    </div>
  );
}
