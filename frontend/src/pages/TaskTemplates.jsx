import { useState, useEffect } from "react";

export default function TaskTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ eventType: "Wedding", taskName: "", assignedRole: "Event Operations Manager" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("taskTemplates")) || [
      { id: 1, eventType: "Wedding", taskName: "Arrange Welcome Flowers", assignedRole: "Banquet Coordinator" },
      { id: 2, eventType: "Wedding", taskName: "Check Sound System", assignedRole: "Event Operations Manager" },
      { id: 3, eventType: "Corporate", taskName: "Setup Projector & Screen", assignedRole: "Banquet Coordinator" },
    ];
    setTemplates(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskTemplates", JSON.stringify(templates));
  }, [templates]);

  const handleAdd = (e) => {
    e.preventDefault();
    setTemplates([...templates, { ...newTemplate, id: Date.now() }]);
    setIsModalOpen(false);
    setNewTemplate({ eventType: "Wedding", taskName: "", assignedRole: "Event Operations Manager" });
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Templates</h1>
          <p className="text-gray-500 text-sm">Define standard operating procedures (SOPs) for events.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          + Add Standard Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event Type</th>
              <th className="px-6 py-3">Task Description</th>
              <th className="px-6 py-3">Assigned Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{t.eventType}</td>
                <td className="px-6 py-4">{t.taskName}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{t.assignedRole}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-400">No templates defined.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Standard Task</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select className="w-full mt-1 p-2 border rounded" value={newTemplate.eventType} onChange={e => setNewTemplate({...newTemplate, eventType: e.target.value})}>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Social</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700">Task Description</label><input type="text" required className="w-full mt-1 p-2 border rounded" value={newTemplate.taskName} onChange={e => setNewTemplate({...newTemplate, taskName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700">Assign To Role</label><select className="w-full mt-1 p-2 border rounded" value={newTemplate.assignedRole} onChange={e => setNewTemplate({...newTemplate, assignedRole: e.target.value})}><option>Event Operations Manager</option><option>Banquet Coordinator</option><option>Kitchen Head</option><option>Inventory Manager</option></select></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}