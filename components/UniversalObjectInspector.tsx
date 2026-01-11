import React, { useState } from 'react';
import Card from './Card';
import { Database, Search, FileCode } from 'lucide-react';

interface UniversalObjectInspectorProps {
  data: any;
  title?: string;
}

const UniversalObjectInspector: React.FC<UniversalObjectInspectorProps> = ({ data, title = "System Signal Inspector" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card title={title} icon={<Database className="text-emerald-400" />}>
      <div className="space-y-4">
        <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Raw Data Object (Read-Only)</p>
        <div className="relative">
            <pre className={`bg-gray-950 p-6 rounded-[2rem] border border-gray-800 font-mono text-[10px] text-emerald-400 overflow-hidden transition-all duration-700 ${isExpanded ? 'max-h-[2000px]' : 'max-h-64'}`}>
                {JSON.stringify(data, null, 2)}
            </pre>
            {!isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent flex items-end justify-center pb-4">
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="px-6 py-2 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all"
                    >
                        Expand Protocol Details
                    </button>
                </div>
            )}
        </div>
        <div className="flex justify-between items-center px-4">
             <div className="flex items-center gap-2">
                <FileCode size={14} className="text-emerald-900" />
                <span className="text-[10px] text-gray-700 uppercase font-mono tracking-tighter">Encoding: application/json</span>
             </div>
             {isExpanded && (
                 <button onClick={() => setIsExpanded(false)} className="text-[10px] text-gray-600 hover:text-white uppercase font-black underline">Collapse</button>
             )}
        </div>
      </div>
    </Card>
  );
};

export default UniversalObjectInspector;
