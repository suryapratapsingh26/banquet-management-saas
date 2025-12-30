import React, { useState } from 'react';

const MOCK_ITEMS = [
  { id: 1, category: 'Venue', name: 'Hall Cleanliness & Dusting', status: 'PENDING', remarks: '' },
  { id: 2, category: 'Venue', name: 'AC Cooling (24°C Check)', status: 'PENDING', remarks: '' },
  { id: 3, category: 'F&B', name: 'Buffet Layout & Linen', status: 'PENDING', remarks: '' },
  { id: 4, category: 'Safety', name: 'Fire Exits Clear', status: 'PENDING', remarks: '' },
  { id: 5, category: 'Staff', name: 'Grooming & Uniform Check', status: 'PENDING', remarks: '' },
  { id: 6, category: 'AV', name: 'Mic & Sound Test', status: 'PENDING', remarks: '' },
];

export default function AuditChecklist() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [auditType, setAuditType] = useState('PRE_EVENT');
  const [auditId, setAuditId] = useState(null);

  const updateStatus = (id, status) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
    if (auditId) {
      const payload = { status };
      fetch(`/api/v1/banquet/audits/${auditId}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Update audit item failed', err));
    }
  };

  const updateRemarks = (id, remarks) => {
    setItems(items.map(i => i.id === id ? { ...i, remarks } : i));
  };

  const calculateScore = () => {
    const total = items.length;
    if (total === 0) return 0;
    const passed = items.filter(i => i.status === 'PASS').length;
    const partial = items.filter(i => i.status === 'PARTIAL').length;
    // Scoring: Pass = 100%, Partial = 50%, Fail = 0%
    return Math.round(((passed + (partial * 0.5)) / total) * 100);
  };

  const score = calculateScore();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header & Scorecard */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center border-l-4 border-pink-600">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Audit Inspection</h2>
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={() => setAuditType('PRE_EVENT')}
              className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wide ${auditType === 'PRE_EVENT' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Pre-Event
            </button>
            <button 
              onClick={() => setAuditType('POST_EVENT')}
              className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wide ${auditType === 'POST_EVENT' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Post-Event
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase font-semibold">Readiness Score</div>
          <div className={`text-3xl font-bold ${score < 85 ? 'text-red-600' : 'text-green-600'}`}>
            {score}%
          </div>
          {score < 85 && <div className="text-xs text-red-500 font-bold mt-1">⚠️ Event Risk</div>}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-lg shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto p-4 space-y-4">
          {items.map(item => (
            <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                </div>
                <div className="flex space-x-1">
                  {['PASS', 'PARTIAL', 'FAIL'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status)}
                      className={`px-3 py-1 text-[10px] font-bold rounded border transition-colors ${
                        item.status === status
                          ? status === 'PASS' ? 'bg-green-100 text-green-700 border-green-300'
                          : status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              {(item.status === 'FAIL' || item.status === 'PARTIAL') && (
                <div className="bg-red-50 p-3 rounded-md mt-2 border border-red-100 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-700 flex items-center">
                      ⚠️ Auto-Task Triggered
                    </span>
                    <button className="text-xs text-blue-600 hover:underline flex items-center">📷 Upload Proof</button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter remarks (Required for Fail/Partial)..."
                    value={item.remarks}
                    onChange={(e) => updateRemarks(item.id, e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded p-2 focus:outline-none focus:border-pink-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-gray-50 text-right">
          <button onClick={async () => {
            try {
              const payload = {
                companyId: 'demo-company',
                eventId: 'EVT123',
                auditType,
                items,
              };
              const res = await fetch('/api/v1/banquet/audits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              const data = await res.json();
              if (!res.ok) throw data;
              setAuditId(data.id);
              await fetch(`/api/v1/banquet/audits/${data.id}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'system' }) });
              alert('Audit submitted');
            } catch (err) {
              console.error(err);
              alert('Failed to submit audit');
            }
          }} className="bg-pink-600 text-white px-6 py-2 rounded shadow hover:bg-pink-700 font-medium text-sm transition-colors">
            Submit Audit
          </button>
        </div>
      </div>
    </div>
  );
}