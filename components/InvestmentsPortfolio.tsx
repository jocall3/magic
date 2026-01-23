import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from './Card';
import { DataContext } from '../context/DataContext';

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const InvestmentsPortfolio: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { assets } = context;

  const totalValue = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);

  return (
    <Card title="Institutional Portfolio" subtitle="Asset classification and risk vectors" className="p-2">
      <div className="space-y-4">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assets}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', fontSize: '9px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1">
          <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-1">Ledger</h4>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2 space-y-1">
            {assets.map((asset, i) => (
              <div key={asset.id} className="flex items-center justify-between group cursor-pointer py-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full" style={{ backgroundColor: asset.color || COLORS[i % COLORS.length] }}></div>
                  <div>
                    <p className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{asset.name}</p>
                    <p className="text-[8px] text-gray-600 font-mono uppercase">{asset.assetClass}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-mono font-bold text-white">${asset.value.toLocaleString()}</p>
                  <p className={`text-[8px] font-bold ${asset.performanceYTD && asset.performanceYTD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performanceYTD && asset.performanceYTD >= 0 ? '+' : ''}{asset.performanceYTD}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800">
           <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none">Beta</p>
                <p className="text-sm font-mono font-bold text-white">1.12</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none">Sharpe</p>
                <p className="text-sm font-mono font-bold text-indigo-400">2.45</p>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentsPortfolio;
