import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Header() {
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [halls, setHalls] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;
    const role = (user.role || '').toUpperCase();
    if (role === 'SUPER_ADMIN') {
      fetch(`${API_URL}/api/platform/tenants`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(setTenants)
        .catch(() => setTenants([]));
    } else if (['OWNER','ADMIN','COMPANY_ADMIN'].includes(role)) {
      fetch(`${API_URL}/api/masters/halls`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(setHalls)
        .catch(() => setHalls([]));
    }
  }, [user, token]);

  const role = (user?.role || '').toUpperCase();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="text-lg font-bold text-pink-600">☰ Asyncotel</button>

        {/* Context Switcher */}
        {role === 'SUPER_ADMIN' && (
          <select className="ml-4 p-2 border rounded text-sm" defaultValue="">
            <option value="">Select Tenant</option>
            {tenants.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
        )}

        {['OWNER','ADMIN','COMPANY_ADMIN'].includes(role) && (
          <select className="ml-4 p-2 border rounded text-sm" defaultValue="">
            <option value="">Select Property</option>
            {halls.map(h => (<option key={h.id} value={h.id}>{h.name}</option>))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_',' ')}</p>
          </div>
          <button onClick={logout} className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-2 rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}