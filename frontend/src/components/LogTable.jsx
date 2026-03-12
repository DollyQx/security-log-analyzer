import React from 'react';
import { format } from 'date-fns';

const LogTable = ({ logs }) => {
    return (
        <div className="table-container">
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>IP Address</th>
                        <th>Username</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-8 text-slate-500">No logs available. Upload a file to get started.</td>
                        </tr>
                    ) : (
                        logs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="text-sm text-slate-400">
                                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                                </td>
                                <td className="font-mono text-sm text-blue-400">{log.ipAddress}</td>
                                <td className="text-sm">{log.username || 'unknown'}</td>
                                <td className="text-sm">
                                    <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                                        {log.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;
