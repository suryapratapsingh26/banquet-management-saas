import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/services`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setServices(await res.json());
        else setServices([]);
      } catch (e) {
        console.error(e);
        setServices([]);
      } finally { setLoading(false); }
    };
    fetchServices();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add-on Services</h1>
        <p className="text-gray-500 text-sm">Manage additional services offered for events.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading services...</div>
        ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4">₹{(service.basePrice || service.cost || 0).toLocaleString()}</td>
                <td className="px-6 py-4">{service.unit || 'per event'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">No add-on services defined.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </>
  );
}