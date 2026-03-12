import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Upload, 
  Search, 
  LayoutDashboard, 
  FileText,
  Terminal
} from 'lucide-react';
import StatsCards from './components/StatsCards';
import AlertsTable from './components/AlertsTable';
import LogTable from './components/LogTable';
import ChartsDashboard from './components/ChartsDashboard';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, alertsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/alerts`),
        axios.get(`${API_BASE}/logs`)
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post(`${API_BASE}/logs/upload`, formData);
      fetchData();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-dark min-h-screen text-white">
      <div className="sidebar p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Shield size={32} className="text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight">SentinelX</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
            <AlertTriangle size={20} />
            <span>Threats</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span>Logs</span>
          </div>
        </nav>

        <div className="mt-auto">
          <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:border-blue-500 rounded-lg cursor-pointer transition-colors group">
            <Upload size={20} className="group-hover:text-blue-500" />
            <span className="text-sm">{uploading ? 'Processing...' : 'Upload Log'}</span>
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <main className="main-content flex-1 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Security Overview</h2>
            <p className="text-slate-400">System health and threat detection monitoring.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-full border border-white/10">
            <Activity size={18} className="text-green-500" />
            <span className="text-sm font-medium">Real-time monitoring active</span>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartsDashboard stats={stats} />
              <AlertsTable alerts={alerts} />
            </div>

            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal size={24} className="text-slate-400" />
                  <h3 className="text-xl font-bold">Recent System Logs</h3>
                </div>
                <div className="text-sm text-slate-400">Total: {stats?.totalAttempts || 0}</div>
              </div>
              <LogTable logs={logs} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
