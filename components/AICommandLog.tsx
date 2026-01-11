import React from 'react';
import Card from './Card';
import { Terminal, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

const AICommandLog: React.FC = () => {
  const logs = [
    { id: 1, action: 'REBALANCE_PORTFOLIO', detail: 'Increased Crypto weighting to 18.5%', status: 'SUCCESS', time: '12m ago' },
    { id: 2, action: 'AUDIT_LEDGER', detail: 'Verified 1,242 entries. Zero delta.', status: 'SUCCESS', time: '1h ago' },
    { id: 3, action: 'HFT_LIQUIDITY_SHIFT', detail: 'Moved $450k to Tokyo node for arbitrage', status: 'SUCCESS', time: '3h ago' },
    { id: 4, action: 'THREAT_MODELING', detail: 'Detected unusual login from GBR. Blocked.', status: 'SUCCESS', time: '5h ago' },
    { id: 5, action: 'GENERATE_REPORT', detail: 'Compiled Q4 Projections', status: 'PENDING', time: 'Just Now' }
  ];

  return (
    <Card title="Neural Audit Log" icon={<Terminal className="text-indigo-400" />}>
      <div className="space-y-4 pt-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-yellow-500 animate-pulse'}`}>
                {log.status === 'SUCCESS' ? <CheckCircle2 size={16}/> : <Clock size={16}/>}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-tight truncate">{log.action}</p>
                <p className="text-[10px] text-gray-500 truncate">{log.detail}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-700">{log.time}</span>
                <ChevronRight className="text-gray-800 group-hover:text-indigo-400" size={14} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AICommandLog;
