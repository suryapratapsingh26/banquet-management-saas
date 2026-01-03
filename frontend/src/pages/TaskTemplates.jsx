import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function TaskTemplates() {
  const [templates, setTemplates] = useState([]);

  // Load templates from storage on mount
  useEffect(() => {
    const storedTemplates = JSON.parse(localStorage.getItem("sopTemplates"));
    if (storedTemplates) {
      setTemplates(storedTemplates);
    } else {
      // Default seed data if nothing exists
      const defaults = [
        {
          id: 1,
          name: "Standard Wedding SOP",
          eventType: "Wedding",
          tasks: [
            { id: 101, title: "Initial Consultation", daysBefore: 60, department: "Sales", priority: "High", isMandatory: true },
            { id: 102, title: "Menu Tasting", daysBefore: 45, department: "F&B", priority: "Medium", isMandatory: false },
            { id: 103, title: "Finalize Decor", daysBefore: 30, department: "Operations", priority: "High", isMandatory: true },
          ]
        }
      ];
      setTemplates(defaults);
      localStorage.setItem("sopTemplates", JSON.stringify(defaults));
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({ name: "", eventType: "Wedding", tasks: [] });
  const [newTask, setNewTask] = useState({ title: "", daysBefore: "", department: "Operations", priority: "Medium", isMandatory: false });

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    setCurrentTemplate({
      ...currentTemplate,
      tasks: [...currentTemplate.tasks, { ...newTask, id: Date.now() }]
    });
    setNewTask({ title: "", daysBefore: "", department: "Operations", priority: "Medium", isMandatory: false });
  };

  const handleSave = () => {
    let updatedTemplates;
    if (currentTemplate.id) {
      updatedTemplates = templates.map(t => t.id === currentTemplate.id ? currentTemplate : t);
    } else {
      updatedTemplates = [...templates, { ...currentTemplate, id: Date.now() }];
    }
    setTemplates(updatedTemplates);
    localStorage.setItem("sopTemplates", JSON.stringify(updatedTemplates));
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Templates (SOPs)</h1>
          <p className="text-gray-500 text-sm">Define standard task lists for different event types.</p>
        </div>
        <button onClick={() => { setCurrentTemplate({ name: "", eventType: "Wedding", tasks: [] }); setIsModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          + Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{template.eventType}</span>
              </div>
              <button onClick={() => handleEdit(template)} className="text-blue-600 text-sm hover:underline cursor-pointer">Edit</button>
            </div>
            <div className="space-y-2">
              {template.tasks.map((task) => (
                <div key={task.id} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    <span className="text-gray-600">{task.title}</span>
                    {task.isMandatory && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">REQ</span>}
                  </div>
                  <span className="text-gray-400 text-xs">T-{task.daysBefore} • {task.department}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Create New SOP Template</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={currentTemplate.name} onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})} placeholder="e.g. Gold Wedding SOP" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select className="w-full mt-1 p-2 border rounded" value={currentTemplate.eventType} onChange={(e) => setCurrentTemplate({...currentTemplate, eventType: e.target.value})}>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-800 mb-2">Add Tasks</h3>
              <div className="grid grid-cols-12 gap-2 mb-4 items-end">
                <div className="col-span-4">
                  <label className="text-xs text-gray-500">Task Title</label>
                  <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Days Before</label>
                  <input type="number" className="w-full p-2 border rounded text-sm" placeholder="Days" value={newTask.daysBefore} onChange={(e) => setNewTask({...newTask, daysBefore: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Dept</label>
                  <select className="w-full p-2 border rounded text-sm" value={newTask.department} onChange={(e) => setNewTask({...newTask, department: e.target.value})}>
                    <option>Operations</option>
                    <option>Sales</option>
                    <option>F&B</option>
                    <option>IT</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Priority</label>
                  <select className="w-full p-2 border rounded text-sm" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-center gap-2 pb-2">
                  <input type="checkbox" checked={newTask.isMandatory} onChange={(e) => setNewTask({...newTask, isMandatory: e.target.checked})} />
                  <span className="text-xs">Mandatory</span>
                  <button onClick={handleAddTask} className="ml-auto bg-gray-800 text-white px-3 py-1 rounded text-sm cursor-pointer">Add</button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-40 overflow-y-auto">
                {currentTemplate.tasks.length === 0 && <p className="text-gray-400 text-sm text-center">No tasks added yet.</p>}
                {currentTemplate.tasks.map((t, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${t.priority === 'High' ? 'bg-red-500' : t.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                      <span>{t.title}</span>
                      {t.isMandatory && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">REQ</span>}
                    </div>
                    <span className="text-gray-500 text-xs">{t.department} • T-{t.daysBefore}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 cursor-pointer">Save Template</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}