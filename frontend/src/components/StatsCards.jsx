import React from 'react';
import { MousePointerClick, ShieldAlert, CheckCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
    const cards = [
        {
            label: 'Total Attempts',
            value: stats?.totalAttempts || 0,
            icon: <MousePointerClick className="text-blue-500" />,
            color: 'blue'
        },
        {
            label: 'Failed Logins',
            value: stats?.failedAttempts || 0,
            icon: <ShieldAlert className="text-red-500" />,
            color: 'red'
        },
        {
            label: 'Success Logins',
            value: stats?.successAttempts || 0,
            icon: <CheckCircle className="text-emerald-500" />,
            color: 'emerald'
        },
        {
            label: 'Suspicious IPs',
            value: stats?.suspiciousIPsCount || 0,
            icon: <Fingerprint className="text-amber-500" />,
            color: 'amber'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card flex items-center justify-between"
                >
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
                        <h4 className="text-2xl font-bold">{card.value.toLocaleString()}</h4>
                    </div>
                    <div className={`p-4 rounded-xl bg-${card.color}-500/10`}>
                        {card.icon}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;
