import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function PaymentModes() {
  const [modes, setModes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchModes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/masters/payment-modes`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setModes(await res.json());
        else setModes([]);
      } catch (e) {
        console.error(e);
        setModes([]);
      } finally { setLoading(false); }
    };
    fetchModes();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Modes</h1>
        <p className="text-gray-500 text-sm">Configure accepted payment methods.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading payment modes...</div>
        ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Mode Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${m.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {m.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Toggle</button>
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