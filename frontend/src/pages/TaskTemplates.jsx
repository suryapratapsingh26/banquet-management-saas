import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../components/AuthContext';

export default function TaskTemplates() {
  const { user } = useAuth();
  const { token } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', eventType: 'WEDDING', items: [] });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchTemplates();
  }, [token]);

  const fetchTemplates = async () => {
    const res = await fetch(`${API_URL}/api/tasks/templates`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setTemplates(await res.json());
  };

  const handleAddItem = () => {
    if (!newItem) return;
    setNewTemplate({ ...newTemplate, items: [...newTemplate.items, { title: newItem, priority: 'MEDIUM', dueOffsetHours: 0 }] });
    setNewItem('');
  };

  const handleSave = async () => {
    await fetch(`${API_URL}/api/tasks/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newTemplate)
    });
    setShowModal(false);
    fetchTemplates();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Templates (SOPs)</h1>
        <button onClick={() => setShowModal(true)} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          + Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="font-bold text-lg">{t.name}</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t.eventType}</span>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {t.items.slice(0, 5).map((item, i) => (
                <li key={i}>• {item.title}</li>
              ))}
              {t.items.length > 5 && <li className="text-gray-400 italic">+ {t.items.length - 5} more</li>}
            </ul>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">New Task Template</h2>
            <input 
              className="w-full p-2 border rounded mb-3" 
              placeholder="Template Name (e.g. Wedding Standard)" 
              value={newTemplate.name}
              onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
            />
            <select 
              className="w-full p-2 border rounded mb-4"
              value={newTemplate.eventType}
              onChange={e => setNewTemplate({...newTemplate, eventType: e.target.value})}
            >
              <option value="WEDDING">Wedding</option>
              <option value="CORPORATE">Corporate</option>
              <option value="BIRTHDAY">Birthday</option>
            </select>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Add Tasks</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-2 border rounded" 
                  placeholder="Task Title" 
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                />
                <button onClick={handleAddItem} className="bg-gray-200 px-3 rounded">+</button>
              </div>
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {newTemplate.items.map((it, i) => (
                  <li key={i} className="text-sm border-b py-1">{it.title}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}