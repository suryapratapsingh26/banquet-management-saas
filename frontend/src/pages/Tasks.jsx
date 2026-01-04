import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Filter tasks relevant to the user's role (or show all for admin)
    if (user?.role === 'admin' || user?.role === 'Owner') {
      setTasks(allTasks);
    } else {
      setTasks(allTasks.filter(t => t.assignedRole === user?.role));
    }
  }, [user]);

  const handleComplete = (taskId) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t);
    setTasks(updatedTasks);
    
    // Update LocalStorage (need to merge with other users' tasks in a real app, here we just save what we see for simplicity or fetch fresh)
    const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newAllTasks = allTasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t);
    localStorage.setItem("tasks", JSON.stringify(newAllTasks));
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-500 text-sm">Pending actions assigned to {user?.role}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div key={task.id} className={`p-4 rounded-xl border flex justify-between items-center ${task.status === 'Completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4 border-l-pink-600 shadow-sm'}`}>
            <div>
              <h3 className={`font-medium ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.description}</h3>
              <p className="text-xs text-gray-500">Event: {task.eventTitle} | Date: {task.eventDate}</p>
            </div>
            <div>
              {task.status !== "Completed" ? (
                <button onClick={() => handleComplete(task.id)} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition">Mark Done</button>
              ) : (
                <span className="text-xs text-green-600 font-bold">Done ✅</span>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="text-center p-8 text-gray-400">No pending tasks found. Good job!</div>}
      </div>
    </AdminLayout>
  );
}