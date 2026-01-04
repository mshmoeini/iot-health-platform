import { AvgHeartRateCard } from './cards/AvgHeartRateCard';
import { AvgSpo2Card } from './cards/AvgSpo2Card';
import { RiskPatientsCard } from './cards/RiskPatientsCard';
import { LowBatteryCard } from './cards/LowBatteryCard';

interface AggregatedMetricsProps {
  metrics: {
    avgHeartRate: number;
    avgSpo2: number;
    patientsInRisk: number;
    lowBatteryDevices: number;
  };
}

export function AggregatedMetrics({ metrics }: AggregatedMetricsProps) {
  return (
    <div className="grid  grid-cols-2 gap-6">
      {/* <AvgHeartRateCard value={metrics?.avgHeartRate ?? "--"} />
      <AvgSpo2Card value={metrics.avgSpo2} /> */}
      <RiskPatientsCard value={metrics.patientsInRisk} />
      <LowBatteryCard value={metrics.lowBatteryDevices} />
    </div>
  );
}
