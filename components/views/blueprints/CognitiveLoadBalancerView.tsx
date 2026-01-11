import React, { useState, useEffect } from 'react';

interface CognitiveMetric {
  timestamp: string;
  avgCognitiveLoad: number; // 0.0 to 1.0
  activeThrottles: string[]; // Feature names being throttled
}

const CognitiveLoadBalancerView: React.FC = () => {
  const [metrics, setMetrics] = useState<CognitiveMetric[]>([]);

  useEffect(() => {
    // MOCK WEBSOCKET
    const interval = setInterval(() => {
      const load = Math.random() * 0.4 + 0.5; // High load scenario
      const newMetric: CognitiveMetric = {
        timestamp: new Date().toISOString(),
        avgCognitiveLoad: load,
        activeThrottles: load > 0.8 ? ['AdvancedAnalytics', 'RealtimeCollaboration'] : load > 0.7 ? ['AdvancedAnalytics'] : [],
      };
      setMetrics(prev => [newMetric, ...prev.slice(0, 9)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Cognitive Load Balancer Dashboard</h1>
      <p className="mb-4 text-gray-400">Watching real-time user cognitive load and adaptively throttling features.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Avg. Cognitive Load</th>
              <th className="p-3">Throttled Features</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(m => (
              <tr key={m.timestamp} className="border-b border-gray-700">
                <td className="p-3 font-mono text-sm">{new Date(m.timestamp).toLocaleTimeString()}</td>
                <td className={`p-3 font-bold ${m.avgCognitiveLoad > 0.75 ? 'text-red-400' : 'text-green-400'}`}>
                  {(m.avgCognitiveLoad * 100).toFixed(1)}%
                </td>
                <td className="p-3">{m.activeThrottles.join(', ') || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CognitiveLoadBalancerView;
