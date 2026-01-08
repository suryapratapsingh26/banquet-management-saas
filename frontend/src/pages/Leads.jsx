import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Leads() {
  const { user } = useAuth();
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ clientName: "", eventType: "WEDDING", stage: "INQUIRY", value: "" });

  useEffect(() => {
    if (!token) return;
    fetchLeads();
  }, [user, token]);

  const fetchLeads = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setLeads(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newLead, value: parseFloat(newLead.value) })
      });
      fetchLeads();
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads Pipeline</h1>
          <p className="text-gray-500 text-sm">Track inquiries and conversions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          + New Inquiry
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Client Name</th>
              <th className="px-6 py-3">Event Type</th>
              <th className="px-6 py-3">Est. Value</th>
              <th className="px-6 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{lead.clientName}</td>
                <td className="px-6 py-4">{lead.eventType}</td>
                <td className="px-6 py-4">₹{lead.value?.toLocaleString()}</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{lead.stage}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Lead</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newLead.clientName} onChange={e => setNewLead({...newLead, clientName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Est. Value (₹)</label>
                <input type="number" className="w-full mt-1 p-2 border rounded" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}