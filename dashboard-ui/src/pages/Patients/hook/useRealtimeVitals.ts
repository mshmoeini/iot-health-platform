import { useEffect, useState } from 'react';
import { Vitals } from '../types/vitals.types';

export function useRealtimeVitals() {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 72,
    spo2: 98,
    temperature: 36.8,
    activityLevel: 'Resting',
    batteryLevel: 85,
    heartRateHistory: Array(20).fill(0).map(() => Math.floor(Math.random() * 20) + 65),
  });

  const [heartRateData, setHeartRateData] = useState<{ time: string; value: number }[]>([]);
  const [spo2Data, setSpo2Data] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getSeconds()}s`;

      const hr = Math.floor(Math.random() * 30) + 65;
      const spo2 = Math.floor(Math.random() * 8) + 93;

      setVitals(v => ({
        ...v,
        heartRate: hr,
        spo2,
        temperature: +(Math.random() * 1 + 36.5).toFixed(1),
        heartRateHistory: [...v.heartRateHistory.slice(1), hr],
      }));

      setHeartRateData(d => [...d.slice(-29), { time: timeStr, value: hr }]);
      setSpo2Data(d => [...d.slice(-29), { time: timeStr, value: spo2 }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { vitals, heartRateData, spo2Data };
}
