import { ArrowLeft, Heart, Droplet, Thermometer, Activity, Battery, Clock, AlertTriangle, Calendar, TrendingUp, Send, User, Phone, Save } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useState, useEffect } from 'react';

interface PatientDetailPageProps {
  patientId: string;
  onBack: () => void;
}

export function PatientDetailPage({ patientId, onBack }: PatientDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'vitals' | 'history' | 'alerts' | 'notifications'>('vitals');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d');

  // Patient-specific notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    caregiverName: 'Dr. Emily Roberts',
    caregiverPhone: '+1-555-0199',
    emergencyContactName: 'John Johnson (Spouse)',
    emergencyContactPhone: '+1-555-0102',
    smsAlertsEnabled: true,
    emergencyEscalationEnabled: true,
    preferredMethod: 'sms' as 'sms' | 'email' | 'both',
    lastNotificationSent: '2 hours ago',
    lastNotificationStatus: 'Delivered',
    // Custom thresholds (null means use global default)
    customHeartRateThreshold: 110,
    customSpo2Threshold: 92,
    customTempThreshold: 37.8,
    notifyOnDisconnect: true,
    notifyOnLowBattery: true,
  });

  // Mock patient data
  const patient = {
    id: patientId,
    name: 'Sarah Johnson',
    age: 62,
    gender: 'Female',
    deviceId: 'WB-2047',
    healthStatus: 'Normal' as const,
    lastUpdate: 'Just now',
    photoUrl: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXRpZW50JTIwcG9ydHJhaXQlMjBtZWRpY2FsfGVufDF8fHx8MTc2NTU1Mjc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // Real-time vitals state
  const [vitals, setVitals] = useState({
    heartRate: 72,
    spo2: 98,
    temperature: 36.8,
    activityLevel: 'Resting',
    batteryLevel: 85,
    heartRateHistory: Array(20).fill(0).map(() => Math.floor(Math.random() * 20) + 65),
  });

  const [heartRateData, setHeartRateData] = useState<{ time: string; value: number }[]>([]);
  const [spo2Data, setSpo2Data] = useState<{ time: string; value: number }[]>([]);

  // Alerts specific to this patient
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      severity: 'warning' as const,
      title: 'Elevated Heart Rate',
      description: 'Heart rate exceeded 100 bpm for 2 minutes',
      timestamp: '2 min ago',
      acknowledged: false,
    },
  ]);

  // Generate historical data based on time range
  const generateHistoricalData = (range: string) => {
    const dataPoints = range === '24h' ? 24 : range === '7d' ? 168 : 720; // hours
    const step = range === '24h' ? 1 : range === '7d' ? 1 : 1;
    
    return Array.from({ length: dataPoints / step }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (dataPoints - i * step));
      
      return {
        time: range === '24h' 
          ? `${date.getHours()}:00`
          : `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
        heartRate: Math.floor(Math.random() * 30) + 65,
        spo2: Math.floor(Math.random() * 8) + 92,
        temperature: parseFloat((Math.random() * 1.5 + 36.5).toFixed(1)),
        battery: Math.floor(Math.random() * 30) + 60,
      };
    });
  };

  const historicalData = generateHistoricalData(timeRange);

  // Generate activity data
  const activityData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    activity: Math.floor(Math.random() * 100),
    label: i >= 6 && i <= 8 ? 'Active' : i >= 12 && i <= 14 ? 'Walking' : 'Resting',
  }));

  // Calculate statistics for history tab
  const historyStats = {
    avgHeartRate: Math.round(historicalData.reduce((acc, d) => acc + d.heartRate, 0) / historicalData.length),
    maxHeartRate: Math.max(...historicalData.map(d => d.heartRate)),
    minHeartRate: Math.min(...historicalData.map(d => d.heartRate)),
    avgSpo2: Math.round(historicalData.reduce((acc, d) => acc + d.spo2, 0) / historicalData.length),
    minSpo2: Math.min(...historicalData.map(d => d.spo2)),
    timeInWarning: Math.floor(Math.random() * 15) + 5, // percentage
    timeInCritical: Math.floor(Math.random() * 3), // percentage
    alertsTriggered: Math.floor(Math.random() * 20) + 5,
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getSeconds()}s`;

      const newHeartRate = Math.floor(Math.random() * 30) + 65;
      const newSpo2 = Math.floor(Math.random() * 8) + 93;
      const newTemp = (Math.random() * 1 + 36.5).toFixed(1);

      setVitals(prev => ({
        ...prev,
        heartRate: newHeartRate,
        spo2: newSpo2,
        temperature: parseFloat(newTemp),
        heartRateHistory: [...prev.heartRateHistory.slice(1), newHeartRate],
      }));

      setHeartRateData(prev => {
        const newData = [...prev, { time: timeStr, value: newHeartRate }];
        return newData.slice(-30);
      });

      setSpo2Data(prev => {
        const newData = [...prev, { time: timeStr, value: newSpo2 }];
        return newData.slice(-30);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statusBadgeStyles = {
    Normal: 'bg-green-100 text-green-800',
    Warning: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
  };

  const getVitalColor = (type: string, value: number) => {
    if (type === 'hr') {
      if (value > 100 || value < 60) return 'text-red-600';
      if (value > 90 || value < 65) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'spo2') {
      if (value < 90) return 'text-red-600';
      if (value < 95) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'temp') {
      if (value >= 38) return 'text-red-600';
      if (value >= 37.5) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-gray-900';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Patient List
      </Button>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <img
            src={patient.photoUrl}
            alt={patient.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl text-gray-900 mb-1">{patient.name}</h2>
                <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
              <Badge className={statusBadgeStyles[patient.healthStatus]}>
                {patient.healthStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Device ID</span>
                <div className="text-gray-900">{patient.deviceId}</div>
              </div>
              <div>
                <span className="text-gray-500">Last Update</span>
                <div className="text-gray-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {patient.lastUpdate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['vitals', 'history', 'alerts', 'notifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-[#3A7AFE] text-[#3A7AFE]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          {/* Real-Time Vital Signs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-6">Real-Time Vital Signs</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {/* Heart Rate */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Heart Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl ${getVitalColor('hr', vitals.heartRate)}`}>
                    {vitals.heartRate}
                  </span>
                  <span className="text-sm text-gray-500">bpm</span>
                </div>
                <div className="h-12 -mx-2">
                  <LineChart width={140} height={48} data={vitals.heartRateHistory.map(v => ({ value: v }))}>
                    <Line type="monotone" dataKey="value" stroke="#3A7AFE" strokeWidth={2} dot={false} />
                  </LineChart>
                </div>
              </div>

              {/* SpO2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Droplet className="w-4 h-4" />
                  <span className="text-sm">SpO₂</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl ${getVitalColor('spo2', vitals.spo2)}`}>
                    {vitals.spo2}
                  </span>
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <div className="relative pt-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        vitals.spo2 < 90 ? 'bg-red-500' :
                        vitals.spo2 < 95 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${vitals.spo2}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm">Temperature</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl ${getVitalColor('temp', vitals.temperature)}`}>
                    {vitals.temperature}
                  </span>
                  <span className="text-sm text-gray-500">°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    vitals.temperature >= 38 ? 'bg-red-500' :
                    vitals.temperature >= 37.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-xs text-gray-500">
                    {vitals.temperature >= 38 ? 'High' :
                     vitals.temperature >= 37.5 ? 'Elevated' : 'Normal'}
                  </span>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Activity</span>
                </div>
                <div className="text-xl text-gray-900">{vitals.activityLevel}</div>
                <div className="text-xs text-gray-500">Motion detected</div>
              </div>

              {/* Battery */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Battery className="w-4 h-4" />
                  <span className="text-sm">Battery</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl text-gray-900">{vitals.batteryLevel}</span>
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        vitals.batteryLevel < 20 ? 'bg-red-500' :
                        vitals.batteryLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${vitals.batteryLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-4">Heart Rate Trend (60s)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#666' }} stroke="#e0e0e0" />
                  <YAxis domain={[40, 120]} tick={{ fontSize: 12, fill: '#666' }} stroke="#e0e0e0" />
                  <Tooltip />
                  <ReferenceLine y={60} stroke="#fbbf24" strokeDasharray="3 3" />
                  <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="value" stroke="#3A7AFE" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 mb-4">SpO₂ Trend (60s)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={spo2Data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#666' }} stroke="#e0e0e0" />
                  <YAxis domain={[85, 100]} tick={{ fontSize: 12, fill: '#666' }} stroke="#e0e0e0" />
                  <Tooltip />
                  <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={95} stroke="#fbbf24" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-gray-900">Historical Analysis</h3>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="custom">Custom Range</option>
                </select>
                <Button size="sm" className="bg-[#3A7AFE] hover:bg-[#2d5fcf]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Avg Heart Rate</span>
              </div>
              <div className="text-2xl text-gray-900">{historyStats.avgHeartRate} <span className="text-sm text-gray-500">bpm</span></div>
              <div className="text-xs text-gray-500 mt-1">Max: {historyStats.maxHeartRate} | Min: {historyStats.minHeartRate}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Droplet className="w-4 h-4" />
                <span className="text-sm">Avg SpO₂</span>
              </div>
              <div className="text-2xl text-gray-900">{historyStats.avgSpo2} <span className="text-sm text-gray-500">%</span></div>
              <div className="text-xs text-gray-500 mt-1">Min: {historyStats.minSpo2}%</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Time in Zones</span>
              </div>
              <div className="text-sm text-gray-900">Warning: {historyStats.timeInWarning}%</div>
              <div className="text-sm text-red-600">Critical: {historyStats.timeInCritical}%</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Alerts Triggered</span>
              </div>
              <div className="text-2xl text-gray-900">{historyStats.alertsTriggered}</div>
              <div className="text-xs text-gray-500 mt-1">In selected period</div>
            </div>
          </div>

          {/* Individual Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heart Rate History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-gray-900">Heart Rate History</h3>
                <p className="text-sm text-gray-500">
                  {timeRange === '24h' ? 'Last 24 hours' : timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                    interval={timeRange === '30d' ? 'preserveStartEnd' : 'auto'}
                  />
                  <YAxis 
                    domain={[40, 140]}
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#e0e0e0"
                    label={{ value: 'bpm', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine y={60} stroke="#fbbf24" strokeDasharray="3 3" label="Low" />
                  <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" label="High" />
                  <ReferenceLine y={historyStats.avgHeartRate} stroke="#3A7AFE" strokeDasharray="5 5" label="Avg" />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#3A7AFE" 
                    strokeWidth={2} 
                    dot={false}
                    name="Heart Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* SpO2 History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-gray-900">SpO₂ History</h3>
                <p className="text-sm text-gray-500">Oxygen saturation trend</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                    interval={timeRange === '30d' ? 'preserveStartEnd' : 'auto'}
                  />
                  <YAxis 
                    domain={[85, 100]}
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#e0e0e0"
                    label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <defs>
                    <linearGradient id="spo2Fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" label="Critical" />
                  <ReferenceLine y={95} stroke="#fbbf24" strokeDasharray="3 3" label="Warning" />
                  <Area 
                    type="monotone" 
                    dataKey="spo2" 
                    stroke="#10b981" 
                    fill="url(#spo2Fill)"
                    strokeWidth={2}
                    name="SpO₂"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-gray-900">Temperature Trend</h3>
                <p className="text-sm text-gray-500">Body temperature monitoring</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                    interval={timeRange === '30d' ? 'preserveStartEnd' : 'auto'}
                  />
                  <YAxis 
                    domain={[36, 39]}
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#e0e0e0"
                    label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <ReferenceLine y={37.5} stroke="#fbbf24" strokeDasharray="3 3" label="Elevated" />
                  <ReferenceLine y={38} stroke="#ef4444" strokeDasharray="3 3" label="Fever" />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f97316" 
                    fill="url(#tempGradient)"
                    strokeWidth={2}
                    name="Temperature"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-gray-900">Activity Timeline</h3>
                <p className="text-sm text-gray-500">Movement intensity over 24 hours</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#e0e0e0"
                    label={{ value: 'Intensity', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
                            <p className="text-sm text-gray-900">{data.hour}</p>
                            <p className="text-sm text-gray-600">Intensity: {data.activity}</p>
                            <p className="text-xs text-gray-500">{data.label}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="activity" 
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Activity Level"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Battery Level Trend */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-gray-900">Battery Level Trend</h3>
                <p className="text-sm text-gray-500">Device battery monitoring over time</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    stroke="#e0e0e0"
                    interval={timeRange === '30d' ? 'preserveStartEnd' : 'auto'}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#666' }}
                    stroke="#e0e0e0"
                    label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label="Low Battery" />
                  <ReferenceLine y={50} stroke="#fbbf24" strokeDasharray="3 3" label="Medium" />
                  <Line 
                    type="monotone" 
                    dataKey="battery" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={false}
                    name="Battery Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-6">Patient Alerts & Events</h3>
          
          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                } ${alert.acknowledged ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <span className={alert.severity === 'critical' ? 'text-red-900' : 'text-yellow-900'}>
                        {alert.title}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      alert.severity === 'critical' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button size="sm" variant="outline">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <h3 className="text-gray-900">Patient Notification Settings</h3>

          {/* Notification Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#3A7AFE]" />
              Notification Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Primary Caregiver</div>
                <div className="text-gray-900">{notificationSettings.caregiverName}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Phone className="w-3 h-3" />
                  {notificationSettings.caregiverPhone}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Emergency Contact</div>
                <div className="text-gray-900">{notificationSettings.emergencyContactName}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Phone className="w-3 h-3" />
                  {notificationSettings.emergencyContactPhone}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Last Notification</div>
                <div className="text-gray-900">{notificationSettings.lastNotificationSent}</div>
                <Badge className="mt-1 bg-green-100 text-green-800">{notificationSettings.lastNotificationStatus}</Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Preferred Communication</div>
                <div className="text-gray-900 capitalize">{notificationSettings.preferredMethod}</div>
              </div>
            </div>
          </div>

          {/* Patient-Specific SMS Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-gray-900 mb-4">Patient-Specific SMS Settings</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Primary Caregiver Name</label>
                  <Input
                    value={notificationSettings.caregiverName}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, caregiverName: e.target.value }))}
                    placeholder="Dr. Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Primary Caregiver Phone Number</label>
                  <Input
                    value={notificationSettings.caregiverPhone}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, caregiverPhone: e.target.value }))}
                    placeholder="+1-555-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Emergency Contact Name</label>
                  <Input
                    value={notificationSettings.emergencyContactName}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                    placeholder="Contact Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Emergency Contact Phone Number</label>
                  <Input
                    value={notificationSettings.emergencyContactPhone}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                    placeholder="+1-555-0000"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-6 rounded-full transition-colors ${notificationSettings.smsAlertsEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                    onClick={() => setNotificationSettings(prev => ({ ...prev, smsAlertsEnabled: !prev.smsAlertsEnabled }))}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.smsAlertsEnabled ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-gray-900">Enable SMS Alerts for this patient</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-6 rounded-full transition-colors ${notificationSettings.emergencyEscalationEnabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                    onClick={() => setNotificationSettings(prev => ({ ...prev, emergencyEscalationEnabled: !prev.emergencyEscalationEnabled }))}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.emergencyEscalationEnabled ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-gray-900">Enable Emergency Escalation SMS</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Preferred Communication Method</label>
                <select
                  value={notificationSettings.preferredMethod}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, preferredMethod: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="both">Both (SMS + Email)</option>
                </select>
              </div>

              <Button variant="outline" className="gap-2">
                <Send className="w-4 h-4" />
                Test SMS (Send to Caregiver)
              </Button>
            </div>
          </div>

          {/* Patient-Specific Alert Rules */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-gray-900 mb-4">Patient-Specific Alert Rules</h4>
            <p className="text-sm text-gray-600 mb-4">
              Customize alert thresholds for this patient. Leave blank to use global defaults.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Notify when Heart Rate exceeds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={notificationSettings.customHeartRateThreshold}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, customHeartRateThreshold: parseInt(e.target.value) }))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">bpm</span>
                    <span className="text-xs text-gray-400 ml-2">(Global default: 120 bpm)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Notify when SpO₂ drops below</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={notificationSettings.customSpo2Threshold}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, customSpo2Threshold: parseInt(e.target.value) }))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                    <span className="text-xs text-gray-400 ml-2">(Global default: 90%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Notify when Temperature exceeds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={notificationSettings.customTempThreshold}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, customTempThreshold: parseFloat(e.target.value) }))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">°C</span>
                    <span className="text-xs text-gray-400 ml-2">(Global default: 38.0°C)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-6 rounded-full transition-colors ${notificationSettings.notifyOnDisconnect ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                    onClick={() => setNotificationSettings(prev => ({ ...prev, notifyOnDisconnect: !prev.notifyOnDisconnect }))}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.notifyOnDisconnect ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-gray-900">Notify on device disconnect</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-6 rounded-full transition-colors ${notificationSettings.notifyOnLowBattery ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}
                    onClick={() => setNotificationSettings(prev => ({ ...prev, notifyOnLowBattery: !prev.notifyOnLowBattery }))}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notificationSettings.notifyOnLowBattery ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-gray-900">Notify on low battery (&lt;20%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
            <Button variant="outline">
              Reset to Global Defaults
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}