import React from 'react';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const AlertsTable = ({ alerts }) => {
    return (
        <div className="glass-card flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={24} className="text-red-500" />
                <h3 className="text-xl font-bold">Security Alerts</h3>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>IP Address</th>
                            <th>Reason</th>
                            <th>Detected At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-8 text-slate-500">No security alerts detected</td>
                            </tr>
                        ) : (
                            alerts.map((alert, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="font-mono text-sm text-blue-400">{alert.ipAddress}</td>
                                    <td className="text-sm">
                                        <span className="badge badge-danger">{alert.reason}</span>
                                    </td>
                                    <td className="text-sm text-slate-400">
                                        {format(new Date(alert.detectedAt), 'MMM dd, HH:mm:ss')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlertsTable;
