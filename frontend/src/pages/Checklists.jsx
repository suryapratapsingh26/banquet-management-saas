import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../components/AuthContext';

export default function Checklists() {
  const [checklists, setChecklists] = useState([]);

  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    fetchChecklists();
  }, [token]);

  const fetchChecklists = async () => {
    const res = await fetch(`${API_URL}/api/checklists`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setChecklists(await res.json());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Event Checklists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklists.length === 0 ? <p className="text-gray-500">No checklists found.</p> : 
          checklists.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold">{c.name}</h3>
              <div className="mt-4 space-y-2">
                {c.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="checkbox" checked={item.isDone} readOnly className="rounded text-orange-600" />
                    <span className={item.isDone ? "line-through text-gray-400" : "text-gray-700"}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}