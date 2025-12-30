import React from 'react';

export default function TaskManager() {
  const tasks = [
    { id:1, text: 'Finalize Menu Options', status: 'Due Today' },
    { id:2, text: 'Prepare Event Schedule', status: 'In Progress' },
    { id:3, text: 'Send Invoice to Client', status: 'Pending' },
  ];

  const badge = (s) => {
    if(s==='Due Today') return 'bg-red-100 text-red-700';
    if(s==='In Progress') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h4 className="font-semibold mb-3">Task Manager</h4>
      <ul className="space-y-3">
        {tasks.map(t => (
          <li key={t.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-700">{t.text}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${badge(t.status)}`}>{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
