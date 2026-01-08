import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../components/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [filterEvent, setFilterEvent] = useState('');

  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    fetchEvents();
    fetchTasks();
  }, [filterEvent, token]);

  const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/api/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setEvents(await res.json());
  };

  const fetchTasks = async () => {
    let url = `${API_URL}/api/tasks`;
    if (filterEvent) url += `?eventId=${filterEvent}`;
    
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setTasks(await res.json());
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchTasks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <select 
          className="p-2 border rounded bg-white"
          onChange={(e) => setFilterEvent(e.target.value)}
        >
          <option value="">All Events</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Task</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{task.title}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{task.priority}</span></td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.status}</span></td>
                <td className="p-4">
                  {task.status !== 'COMPLETED' && <button onClick={() => updateStatus(task.id, 'COMPLETED')} className="text-green-600 hover:underline">Mark Done</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}