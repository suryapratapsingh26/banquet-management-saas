import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const allTasks = await res.json();
        // Filter client-side for now
        const myTasks = (user.role === 'admin' || user.role === 'Owner') 
          ? allTasks 
          : allTasks.filter(t => t.assigned_role === user.role);
        setTasks(myTasks);
      }
    } catch (error) { console.error(error); }
  };

  const handleComplete = async (taskId) => {
    const token = await user.getIdToken();
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: "Completed" })
    });
    fetchTasks();
  };

  const getSLAStatus = (task) => {
    if (task.status === "Completed") return { label: "Completed", color: "bg-green-100 text-green-800" };
    
    const today = new Date().toISOString().split('T')[0];
    if (task.dueDate < today) return { label: "Escalated 🔥", color: "bg-red-100 text-red-800 font-bold" };
    if (task.dueDate === today) return { label: "At Risk ⚠️", color: "bg-orange-100 text-orange-800 font-bold" };
    return { label: "On Track", color: "bg-blue-100 text-blue-800" };
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-500 text-sm">Pending actions assigned to {user?.role}.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => {
          const sla = getSLAStatus(task);
          return (
          <div key={task.id} className={`p-4 rounded-xl border flex justify-between items-center ${task.status === 'Completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4 border-l-pink-600 shadow-sm'}`}>
            <div>
              <h3 className={`font-medium ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.description}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Event: {task.eventTitle} | Due: {task.dueDate} <span className={`ml-2 px-2 py-0.5 rounded text-[10px] ${sla.color}`}>{sla.label}</span>
              </p>
            </div>
            <div>
              {task.status !== "Completed" ? (
                <button onClick={() => handleComplete(task.id)} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition">Mark Done</button>
              ) : (
                <span className="text-xs text-green-600 font-bold">Done ✅</span>
              )}
            </div>
          </div>
          );
        })}
        {tasks.length === 0 && <div className="text-center p-8 text-gray-400">No pending tasks found. Good job!</div>}
      </div>
    </>
  );
}