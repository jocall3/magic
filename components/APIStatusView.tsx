// components/views/platform/APIStatusView.tsx
import React, { useContext } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { APIStatus } from '../../../types';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, YAxis } from 'recharts';

const APIStatusView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIStatusView must be within a DataProvider.");
    const { apiStatus } = context;

    const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
        const colors = {
            'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
            'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
            'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
            'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        };
        const style = colors[status];
        return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                {status}
            </div>
        );
    };
    
    // Generate more realistic, fluctuating data for the chart
    const liveTrafficData = Array.from({ length: 40 }, (_, i) => ({
        name: i,
        plaid: 80 + Math.random() * 40,
        stripe: 60 + Math.random() * 30,
        gemini: 20 + Math.random() * 50
    }));


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">System & API Status</h2>
            <Card>
                <div className="space-y-3">
                    {apiStatus.map(api => (
                        <div key={api.provider} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                            <h4 className="font-semibold text-lg text-white mb-2 sm:mb-0">{api.provider}</h4>
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-gray-400 font-mono">{api.responseTime}ms</p>
                                <StatusIndicator status={api.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Simulated Live API Traffic (Requests/sec)">
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={liveTrafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                 <linearGradient id="colorPlaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient>
                                 <linearGradient id="colorStripe" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/><stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/></linearGradient>
                                 <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                             </defs>
                             <YAxis stroke="#9ca3af" fontSize={12} />
                             <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                             <Area type="monotone" dataKey="plaid" stroke="#8884d8" fill="url(#colorPlaid)" name="Plaid" />
                             <Area type="monotone" dataKey="stripe" stroke="#82ca9d" fill="url(#colorStripe)" name="Stripe" />
                             <Area type="monotone" dataKey="gemini" stroke="#06b6d4" fill="url(#colorGemini)" name="Gemini" />
                         </AreaChart>
                     </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default APIStatusView;
