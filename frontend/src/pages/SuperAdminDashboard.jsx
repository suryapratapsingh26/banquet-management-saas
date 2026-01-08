import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, mrr: 0, avgEvents: 0 });

  const { token } = useAuth();
  useEffect(() => { if (token) fetchTenants(); }, [token]);

  const fetchTenants = async () => {
    try {
      const res = await fetch(`${API_URL}/api/platform/tenants`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
        setStats({ total: data.length, active: data.length, mrr: 0, avgEvents: 0 });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-sm text-gray-500">Asyncotel platform overview</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Welcome</p>
          <p className="text-lg font-semibold text-gray-800">{user?.name || 'Super Admin'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tenants" value={stats.total} />
        <StatCard label="Active Tenants" value={stats.active} />
        <StatCard label="MRR (est)" value={`₹${(stats.mrr).toLocaleString()}`} />
        <StatCard label="Avg Events / Tenant" value={stats.avgEvents || '—'} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4">All Tenants</h3>
        <div className="space-y-2">
          {tenants.map(t => (
            <div key={t.id} className="p-3 flex justify-between items-center border rounded hover:shadow-sm">
              <div>
                <div className="font-medium text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-500">{t.brandName || '—'}</div>
              </div>
              <div className="text-sm text-gray-600">{t.subscription}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-xl border bg-FCE4EC" style={{ borderColor: '#E0E0E0' }}>
      <p className="text-xs font-bold uppercase opacity-70 mb-1 text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}