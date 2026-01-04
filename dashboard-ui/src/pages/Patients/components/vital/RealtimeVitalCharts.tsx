import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type Point = {
  time: string;
  value: number;
};

type Props = {
  heartRateData: Point[];
  spo2Data: Point[];
};

export function RealtimeVitalCharts({
  heartRateData,
  spo2Data,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ================= Heart Rate Trend ================= */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-gray-900 mb-4">
          Heart Rate Trend (60s)
        </h3>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={heartRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <YAxis
              domain={[40, 120]}
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <Tooltip />

            {/* Thresholds */}
            <ReferenceLine y={60} stroke="#fbbf24" strokeDasharray="3 3" />
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#3A7AFE"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= SpO2 Trend ================= */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-gray-900 mb-4">
          SpO₂ Trend (60s)
        </h3>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={spo2Data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <YAxis
              domain={[85, 100]}
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <Tooltip />

            {/* Thresholds */}
            <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={95} stroke="#fbbf24" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
