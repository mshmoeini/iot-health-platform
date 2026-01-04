import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { HistoryPoint } from '../../types/history.types';

type Props = {
  data: HistoryPoint[];
};

export function HistoryCharts({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Heart Rate */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="mb-2 text-gray-900">Heart Rate History</h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[50, 140]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#3A7AFE"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SpO2 */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="mb-2 text-gray-900">SpO₂ History</h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[85, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spo2"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="mb-2 text-gray-900">Temperature</h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[36, 39]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Battery */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="mb-2 text-gray-900">Battery Level</h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="battery"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
