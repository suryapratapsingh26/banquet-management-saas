import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

// Pre-defined templates for different audit types
const AUDIT_TEMPLATES = {
  PRE_EVENT: [
    { id: 'p1', category: 'Venue Readiness', item: 'Hall deep cleaned and sanitized' },
    { id: 'p2', category: 'Venue Readiness', item: 'AC / HVAC system working correctly' },
    { id: 'p3', category: 'Venue Readiness', item: 'All lights and fixtures functional' },
    { id: 'p4', category: 'F&B Readiness', item: 'Buffet layout matches BEO' },
    { id: 'p5', category: 'F&B Readiness', item: 'Crockery & cutlery polished and sufficient' },
    { id: 'p6', category: 'Safety', item: 'Fire exits are clear and marked' },
  ],
  POST_EVENT: [
    { id: 'd1', category: 'Damage Assessment', item: 'Furniture (chairs, tables) count and condition check' },
    { id: 'd2', category: 'Damage Assessment', item: 'Linen stains or tears check' },
    { id: 'd3', category: 'Damage Assessment', item: 'Wall, floor, or fixture damage check' },
    { id: 'w1', category: 'Wastage Control', item: 'Food wastage recorded' },
    { id: 'c1', category: 'Closure', item: 'Client belongings cleared' },
  ]
};

export default function EventAuditTab({ event }) {
  const { user } = useAuth();
  const canAudit = ['Event Operations Manager', 'Property Admin', 'Owner', 'admin'].includes(user?.role);

  const [audits, setAudits] = useState([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [currentAudit, setCurrentAudit] = useState(null);

  useEffect(() => {
    if (event) {
      const allAudits = JSON.parse(localStorage.getItem("audits")) || [];
      setAudits(allAudits.filter(a => a.eventId === parseInt(event.id)));
    }
  }, [event]);

  const handleStartAudit = () => {
    setCurrentAudit({
      id: Date.now(),
      eventId: event.id,
      eventName: event.name,
      type: 'PRE_EVENT',
      status: 'In Progress',
      score: 0,
      results: {}
    });
    setIsAuditModalOpen(true);
  };

  const handleSaveAudit = () => {
    const template = AUDIT_TEMPLATES[currentAudit.type];
    const totalItems = template.length;
    let score = 0;
    Object.values(currentAudit.results).forEach(result => {
      if (result.status === 'PASS') score += 1;
      if (result.status === 'PARTIAL') score += 0.5;
    });
    const finalScore = totalItems > 0 ? Math.round((score / totalItems) * 100) : 100;

    const finalAudit = { ...currentAudit, status: 'Completed', score: finalScore };
    
    const allAudits = JSON.parse(localStorage.getItem("audits")) || [];
    const updatedAudits = [...allAudits.filter(a => a.id !== finalAudit.id), finalAudit];
    localStorage.setItem("audits", JSON.stringify(updatedAudits));
    setAudits(updatedAudits.filter(a => a.eventId === parseInt(event.id))); // Refresh local state
    setIsAuditModalOpen(false);
  };

  const handleItemStatusChange = (itemId, newStatus) => {
    setCurrentAudit(prev => ({
      ...prev,
      results: { ...prev.results, [itemId]: { ...prev.results[itemId], status: newStatus } }
    }));
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Audit History</h3>
          {canAudit && (
            <button onClick={handleStartAudit} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer">
              + New Audit
            </button>
          )}
        </div>
        {audits.length === 0 ? (
          <p className="text-sm text-gray-500 text-center p-8">No audits conducted for this event yet.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Audit Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {audits.map(audit => (
                <tr key={audit.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{audit.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${audit.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{audit.status}</span></td>
                  <td className="px-6 py-4 font-bold">{audit.status === 'Completed' ? `${audit.score}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Audit Modal */}
      {isAuditModalOpen && currentAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Conduct Audit for {event.name}</h2>
            <div className="mb-4">
              <select className="w-full p-2 border rounded" value={currentAudit.type} onChange={e => setCurrentAudit({...currentAudit, type: e.target.value, results: {}})}>
                <option value="PRE_EVENT">Pre-Event Audit</option>
                <option value="POST_EVENT">Post-Event Audit</option>
              </select>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg">
              {AUDIT_TEMPLATES[currentAudit.type].map(item => (
                <div key={item.id} className="p-3 bg-white rounded border grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-800 text-sm">{item.item}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex gap-1">
                    {['PASS', 'PARTIAL', 'FAIL'].map(status => (
                      <button 
                        key={status}
                        type="button"
                        onClick={() => handleItemStatusChange(item.id, status)}
                        className={`w-full text-xs py-1 rounded ${currentAudit.results[item.id]?.status === status ? 
                          (status === 'PASS' ? 'bg-green-600 text-white' : status === 'PARTIAL' ? 'bg-yellow-500 text-white' : 'bg-red-600 text-white') : 
                          'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button type="button" onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
              <button type="button" onClick={handleSaveAudit} className="px-6 py-2 bg-pink-600 text-white rounded cursor-pointer">Complete & Save Audit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}