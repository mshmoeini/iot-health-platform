import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface HistoricalDataProps {
  historicalData: {
    time: string;
    heartRate: number;
    spo2: number;
  }[];
  statistics: {
    avgHeartRate: number;
    minHeartRate: number;
    maxHeartRate: number;
    avgSpo2: number;
    minSpo2: number;
    maxSpo2: number;
  };
}

export function HistoricalData({ historicalData, statistics }: HistoricalDataProps) {
  const [selectedDate] = useState('Dec 12, 2024');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900">History & Analytics</h3>
          <p className="text-sm text-gray-500">Multi-hour trend analysis</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">{selectedDate}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e0e0e0"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e0e0e0"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
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
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="heartRate"
            stroke="#3A7AFE"
            strokeWidth={2}
            dot={false}
            name="Heart Rate (bpm)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="spo2"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="SpO₂ (%)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Avg Heart Rate</p>
          <p className="text-xl text-gray-900">{statistics.avgHeartRate} <span className="text-sm text-gray-500">bpm</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Min / Max HR</p>
          <p className="text-xl text-gray-900">
            {statistics.minHeartRate} / {statistics.maxHeartRate}
            <span className="text-sm text-gray-500"> bpm</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Avg SpO₂</p>
          <p className="text-xl text-gray-900">{statistics.avgSpo2} <span className="text-sm text-gray-500">%</span></p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Min / Max SpO₂</p>
          <p className="text-xl text-gray-900">
            {statistics.minSpo2} / {statistics.maxSpo2}
            <span className="text-sm text-gray-500"> %</span>
          </p>
        </div>
      </div>
    </div>
  );
}
