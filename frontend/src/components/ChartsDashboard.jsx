import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ChartsDashboard = ({ stats }) => {
    const hourlyData = stats?.hourlyStats || [];

    const labels = hourlyData.map(d => `${d._id}:00`);

    const lineData = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Total Attempts',
                data: hourlyData.map(d => d.count),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
            {
                fill: true,
                label: 'Failed Attempts',
                data: hourlyData.map(d => d.failed),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', boxWidth: 12, usePointStyle: true }
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="glass-card flex flex-col">
            <h3 className="text-xl font-bold mb-6">Activity Trends (24h)</h3>
            <div className="flex-1 min-h-[300px]">
                <Line data={lineData} options={options} />
            </div>
        </div>
    );
};

export default ChartsDashboard;
