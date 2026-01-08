import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/roles`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setRoles(await res.json());
        else setRoles([]);
      } catch (e) {
        console.error(e);
        setRoles([]);
      } finally { setLoading(false); }
    };
    fetchRoles();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm">Define user roles within the organization.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading roles...</div>
        ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Role Name</th>
              <th className="px-6 py-3">Department / Notes</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{(r.permissions || []).slice(0,3).join(', ')}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Manage Permissions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </>
  );
}