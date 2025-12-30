import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatusBadge from "../components/StatusBadge";
import AddTaskModal from "../components/AddTaskModal";

export default function Tasks() {
  const [activeDept, setActiveDept] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = [
    { id: 1, task: "Prepare Starter Batch", dept: "Kitchen", time: "12:00", status: "Pending", priority: "High" },
    { id: 2, task: "Marination Done", dept: "Kitchen", time: "10:00", status: "Confirmed", priority: "Medium" },
    { id: 3, task: "Dessert Setup", dept: "Kitchen", time: "17:00", status: "Pending", priority: "Low" },
    { id: 4, task: "Hall Layout Setup", dept: "Ops", time: "09:00", status: "Confirmed", priority: "High" },
    { id: 5, task: "Sound Check", dept: "Ops", time: "11:00", status: "Pending", priority: "Medium" },
  ];

  const departments = ["All", "Kitchen", "Ops", "F&B", "Housekeeping", "Accounts"];

  const filteredTasks = activeDept === "All" ? tasks : tasks.filter(t => t.dept === activeDept);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Task Management</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition"
          >
            + Add Task
          </button>
        </div>

        {/* Department Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeDept === dept 
                  ? "bg-gray-800 text-white" 
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Task Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Deadline</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-pink-600 focus:ring-pink-500" />
                      {task.task}
                    </div>
                  </td>
                  <td className="px-6 py-4">{task.dept}</td>
                  <td className="px-6 py-4">{task.time}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </AdminLayout>
  );
}