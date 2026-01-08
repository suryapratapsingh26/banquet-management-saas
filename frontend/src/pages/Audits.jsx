import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../components/AuthContext';

export default function Audits() {
  const [audits, setAudits] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAudit, setNewAudit] = useState({ eventId: '', auditType: 'PRE_EVENT', items: [] });

  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async () => {
    const [resAudits, resEvents] = await Promise.all([
      fetch(`${API_URL}/api/audits`, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(`${API_URL}/api/events?status=CONFIRMED`, { headers: { 'Authorization': `Bearer ${token}` } })
    ]);
    
    if (resAudits.ok) setAudits(await resAudits.json());
    if (resEvents.ok) setEvents(await resEvents.json());
  };

  const handleSave = async () => {
    // Mock items for MVP
    const auditData = {
      ...newAudit,
      items: [
        { question: "Cleanliness", status: "PASS" },
        { question: "Staff Uniform", status: "PASS" },
        { question: "Food Temperature", status: "PASS" }
      ],
      score: 100
    };

    await fetch(`${API_URL}/api/audits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(auditData)
    });
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quality Audits</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Audit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Score</th>
              <th className="p-4">Auditor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {audits.map(a => (
              <tr key={a.id}>
                <td className="p-4">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{a.auditType}</td>
                <td className="p-4 font-bold text-green-600">{a.score}%</td>
                <td className="p-4">{a.submittedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Start New Audit</h2>
            <select className="w-full p-2 border rounded mb-4" onChange={e => setNewAudit({...newAudit, eventId: parseInt(e.target.value)})}>
              <option value="">Select Event</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded">Start Audit</button>
            <button onClick={() => setShowModal(false)} className="w-full mt-2 text-gray-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}