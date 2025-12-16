import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface RealTimeChartsProps {
  heartRateData: { time: string; value: number }[];
  spo2Data: { time: string; value: number }[];
}

export function RealTimeCharts({ heartRateData, spo2Data }: RealTimeChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Heart Rate Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-gray-900">Heart Rate Trend</h3>
          <p className="text-sm text-gray-500">Last 30 seconds</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={heartRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <YAxis
              domain={[40, 120]}
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            />
            <ReferenceLine y={60} stroke="#fbbf24" strokeDasharray="3 3" label="Min" />
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label="Max" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3A7AFE"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SpO2 Trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-gray-900">SpO₂ Trend</h3>
          <p className="text-sm text-gray-500">Last 30 seconds</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={spo2Data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <YAxis
              domain={[85, 100]}
              tick={{ fontSize: 12, fill: '#666' }}
              stroke="#e0e0e0"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            />
            <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label="Critical" />
            <ReferenceLine y={95} stroke="#fbbf24" strokeDasharray="3 3" label="Warning" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
