import React, { useState } from 'react';

const MOCK_TASKS = [
  { id: 'T1', title: 'Stage décor setup', status: 'OPEN', priority: 'HIGH', sla: '4h', owner: 'Decor Vendor', event: 'Wedding - Sharma' },
  { id: 'T2', title: 'Buffet refill monitoring', status: 'IN_PROGRESS', priority: 'MEDIUM', sla: 'Continuous', owner: 'F&B Manager', event: 'Wedding - Sharma' },
  { id: 'T3', title: 'Sound & light testing', status: 'COMPLETED', priority: 'HIGH', sla: 'Done', owner: 'AV Team', event: 'Wedding - Sharma' },
  { id: 'T4', title: 'Guest pax lock', status: 'BLOCKED', priority: 'CRITICAL', sla: '-2h', owner: 'Sales', event: 'Corp - TechConf' },
  { id: 'T5', title: 'Fire & safety approval', status: 'ESCALATED', priority: 'HIGH', sla: 'BREACHED', owner: 'Ops Manager', event: 'Wedding - Sharma' },
];

const COLUMNS = [
  { id: 'OPEN', label: 'Open', color: 'bg-gray-100 border-gray-300' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-50 border-blue-200' },
  { id: 'BLOCKED', label: 'Blocked', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'ESCALATED', label: 'Escalated', color: 'bg-red-50 border-red-200' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-green-50 border-green-200' },
];

export default function TaskKanban() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  // In a real app, drag-and-drop logic would go here (e.g., using react-beautiful-dnd)
  // For now, we just render the lists.

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-150px)]">
      {COLUMNS.map(col => (
        <div key={col.id} className={`min-w-[300px] w-80 rounded-lg border flex flex-col ${col.color}`}>
          <div className="p-3 font-bold text-gray-700 border-b border-gray-200 flex justify-between">
            <span>{col.label}</span>
            <span className="bg-white px-2 rounded text-sm border">{tasks.filter(t => t.status === col.id).length}</span>
          </div>
          <div className="p-2 flex-1 overflow-y-auto space-y-3">
            {tasks.filter(t => t.status === col.id).map(task => (
              <div key={task.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    task.priority === 'HIGH' || task.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-400">{task.id}</span>
                </div>
                <h4 className="font-medium text-gray-800 text-sm mb-1">{task.title}</h4>
                <div className="text-xs text-gray-500 mb-2">{task.event}</div>
                <div className="flex justify-between items-center text-xs text-gray-600 border-t pt-2 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold">
                      {task.owner.charAt(0)}
                    </span>
                    <span>{task.owner}</span>
                  </div>
                  <div className={`${task.sla === 'BREACHED' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    ⏱ {task.sla}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}