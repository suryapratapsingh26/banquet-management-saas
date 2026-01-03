import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState("Pending");
  const [deptFilter, setDeptFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalAction, setModalAction] = useState(""); // 'complete', 'block'
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem("eventTasks")) || [];
    setTasks(allTasks);
  }, []);

  useEffect(() => {
    let result = tasks;

    // Tab Filter
    result = result.filter(t => t.status === activeTab);

    // Dropdown Filters
    if (deptFilter !== "All") result = result.filter(t => t.department === deptFilter);
    if (priorityFilter !== "All") result = result.filter(t => t.priority === priorityFilter);

    // Time Filter
    if (timeFilter !== "All") {
      const todayStr = new Date().toISOString().split('T')[0];
      if (timeFilter === "Due Today") result = result.filter(t => t.dueDate === todayStr);
      if (timeFilter === "Overdue") result = result.filter(t => t.dueDate < todayStr);
      if (timeFilter === "Upcoming") result = result.filter(t => t.dueDate > todayStr);
    }

    setFilteredTasks(result);
  }, [tasks, activeTab, deptFilter, priorityFilter, timeFilter]);

  const updateTaskStatus = (taskId, newStatus, note = "") => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus, note: note } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("eventTasks", JSON.stringify(updatedTasks));
  };

  const handleStart = (taskId) => updateTaskStatus(taskId, "In Progress");

  const openModal = (task, action) => {
    setSelectedTask(task);
    setModalAction(action);
    setActionNote(task.note || "");
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e) => {
    e.preventDefault();
    const newStatus = modalAction === "complete" ? "Completed" : "Blocked";
    updateTaskStatus(selectedTask.id, newStatus, actionNote);
    setIsModalOpen(false);
  };

  const getSLAIndicator = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-red-600 font-bold text-xs">OVERDUE ({Math.abs(diffDays)}d)</span>;
    if (diffDays === 0) return <span className="text-orange-600 font-bold text-xs">DUE TODAY</span>;
    if (diffDays <= 2) return <span className="text-yellow-600 font-bold text-xs">{diffDays} Days Left</span>;
    return <span className="text-green-600 text-xs">{diffDays} Days Left</span>;
  };

  return (
    <AdminLayout>
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
          <p className="text-gray-500 text-sm">Operational execution & tracking.</p>
        </div>
        <div className="flex gap-2">
            <select className="border rounded p-2 text-sm" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                <option value="All">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="F&B">F&B</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Security">Security</option>
            </select>
            <select className="border rounded p-2 text-sm" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <select className="border rounded p-2 text-sm" value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
                <option value="All">All Time</option>
                <option value="Due Today">Due Today</option>
                <option value="Overdue">Overdue</option>
                <option value="Upcoming">Upcoming</option>
            </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {["Pending", "In Progress", "Blocked", "Completed"].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer ${activeTab === tab ? 'border-b-2 border-pink-600 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>No {activeTab.toLowerCase()} tasks found.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Dept</th>
                <th className="px-6 py-3">SLA / Due</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.note && <div className="text-xs text-gray-400 mt-1">Note: {task.note}</div>}
                  </td>
                  <td className="px-6 py-4 text-pink-600">{task.eventName}</td>
                  <td className="px-6 py-4">{task.department}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{task.dueDate}</div>
                    {activeTab !== "Completed" && getSLAIndicator(task.dueDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{task.priority}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {activeTab === "Pending" && (
                        <button onClick={() => handleStart(task.id)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">Start</button>
                    )}
                    {(activeTab === "Pending" || activeTab === "In Progress") && (
                        <>
                            <button onClick={() => openModal(task, "complete")} className="text-green-600 hover:underline text-xs font-medium cursor-pointer">Done</button>
                            <button onClick={() => openModal(task, "block")} className="text-red-600 hover:underline text-xs font-medium cursor-pointer">Block</button>
                        </>
                    )}
                    {activeTab === "Blocked" && (
                        <button onClick={() => handleStart(task.id)} className="text-blue-600 hover:underline text-xs font-medium cursor-pointer">Unblock</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {modalAction === "complete" ? "Complete Task" : "Block Task"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    {modalAction === "complete" ? "Upload proof or add a completion note." : "Why is this task blocked?"}
                </p>
                <form onSubmit={handleSubmitModal}>
                    <textarea 
                        className="w-full border rounded p-2 text-sm mb-4" 
                        rows="3" 
                        placeholder={modalAction === "complete" ? "Notes / Proof URL..." : "Reason for blocking..."}
                        value={actionNote}
                        onChange={e => setActionNote(e.target.value)}
                        required
                    ></textarea>
                    {modalAction === "complete" && (
                        <div className="mb-4 p-3 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-xs text-gray-500 cursor-pointer hover:bg-gray-100">
                            📷 Upload Photo Proof (Mock)
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer">Cancel</button>
                        <button type="submit" className={`px-4 py-2 text-white rounded text-sm cursor-pointer ${modalAction === "complete" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                            {modalAction === "complete" ? "Mark Completed" : "Block Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </AdminLayout>
  );
}