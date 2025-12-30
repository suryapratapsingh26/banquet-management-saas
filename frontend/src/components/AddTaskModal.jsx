import { useState } from "react";

export default function AddTaskModal({ onClose }) {
  const departments = ["Kitchen", "Ops", "F&B", "Housekeeping", "Accounts"];
  const priorities = ["High", "Medium", "Low"];

  const [taskData, setTaskData] = useState({
    taskName: "",
    department: "Kitchen",
    priority: "Medium",
    deadline: "",
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving Task:", taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Task</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input name="taskName" type="text" value={taskData.taskName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" placeholder="e.g., Finalize stage decoration" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select name="department" value={taskData.department} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {departments.map(dept => <option key={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select name="priority" value={taskData.priority} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input name="deadline" type="time" value={taskData.deadline} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}