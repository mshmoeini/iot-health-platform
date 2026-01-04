import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

import type { SystemMonitoringChartsProps } from '../types/monitoring.types';

export function SystemMonitoringCharts({
  alertsTrendData,
  vitalsTrendData,
}: SystemMonitoringChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alerts Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-gray-900">System Alerts Trend</h3>
          <p className="text-sm text-gray-500">Last 30 minutes</p>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={alertsTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#666' }} />
            <YAxis tick={{ fontSize: 12, fill: '#666' }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="alerts"
              stroke="#ef4444"
              fill="#fecaca"
              strokeWidth={2}
              name="Active Alerts"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Vitals Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-gray-900">Average Vitals Trend</h3>
          <p className="text-sm text-gray-500">All devices - Last 30 minutes</p>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={vitalsTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#666' }} />

            <YAxis yAxisId="left" domain={[50, 110]} />
            <YAxis yAxisId="right" orientation="right" domain={[85, 100]} />

            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              dataKey="avgHeartRate"
              stroke="#3A7AFE"
              strokeWidth={2}
              dot={false}
              name="Avg HR (bpm)"
            />

            <Line
              yAxisId="right"
              dataKey="avgSpo2"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Avg SpO₂ (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
