// components/views/corporate/ComplianceView.tsx
import React, { useContext } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { ComplianceCase } from '../../../types';

const ComplianceView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) throw new Error("ComplianceView must be within a DataProvider.");
    const { complianceCases } = context;

    const StatusBadge: React.FC<{ status: 'open' | 'closed' }> = ({ status }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${status === 'open' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300'}`}>{status}</span>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Compliance Center</h2>
            <Card title="Open Cases">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-900/30">
                            <tr>
                                <th scope="col" className="px-6 py-3">Case ID</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Entity</th>
                                <th scope="col" className="px-6 py-3">Opened</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complianceCases.map(c => (
                                <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-white">{c.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{c.reason}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{c.entityType}<br/>{c.entityId}</td>
                                    <td className="px-6 py-4">{c.openedDate}</td>
                                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                    <td className="px-6 py-4">
                                        {c.status === 'open' && (
                                            <button className="text-xs text-cyan-300 hover:underline">Review Case</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
             <Card title="Compliance Ruleset" isCollapsible defaultCollapsed>
                <p className="text-gray-400 text-sm">This section would allow administrators to view and manage the automated rules that trigger compliance cases (e.g., 'Block payments to sanctioned countries', 'Flag all transactions over $10,000').</p>
            </Card>
        </div>
    );
};

export default ComplianceView;
