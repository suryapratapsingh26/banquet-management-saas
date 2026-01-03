import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";
import EventAuditTab from "./EventAuditTab";
import FunctionSheetTab from "./FunctionSheetTab";
import Tabs from "./Tabs";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState([]);

  const TABS = [
    { name: "overview", label: "Overview" },
    { name: "tasks", label: `Tasks (${tasks.length})` },
    { name: "function-sheet", label: "Function Sheet" },
    { name: "audits", label: "Audits" },
  ];

  // Mock Data Loader
  useEffect(() => {
    // In real app, fetch event by ID
    const allEvents = JSON.parse(localStorage.getItem("events")) || [];
    const foundEvent = allEvents.find(e => e.id === parseInt(id));
    setEvent(foundEvent);

    // Load existing tasks for this event from localStorage
    const allTasks = JSON.parse(localStorage.getItem("eventTasks")) || [];
    setTasks(allTasks.filter(t => t.eventId === parseInt(id)));
  }, [id]);

  // ---------------------------------------------------------
  // 🚀 STEP 3.2: AUTO TASK GENERATION ENGINE
  // ---------------------------------------------------------
  const handleConfirmEvent = () => {
    if (!window.confirm("Confirming this event will generate all operational tasks based on the SOP. Continue?")) return;

    // 1. Fetch Templates
    const templates = JSON.parse(localStorage.getItem("sopTemplates")) || [];
    const template = templates.find(t => t.eventType === event.type);

    if (!template) {
      alert(`No SOP Template found for ${event.type}. Please create one in Task Templates.`);
      return;
    }

    // 2. Generate Tasks
    const eventDate = new Date(event.date);
    const newTasks = template.tasks.map(t => {
      const dueDate = new Date(eventDate);
      dueDate.setDate(eventDate.getDate() - t.daysBefore);

      return {
        id: Date.now() + Math.random(),
        eventId: event.id,
        eventName: event.name,
        title: t.title,
        department: t.department,
        priority: t.priority,
        status: "Pending",
        dueDate: dueDate.toISOString().split('T')[0], // YYYY-MM-DD
        isMandatory: t.isMandatory
      };
    });

    // 3. Save to DB (LocalStorage)
    const existingTasks = JSON.parse(localStorage.getItem("eventTasks")) || [];
    const updatedTasks = [...existingTasks, ...newTasks];
    localStorage.setItem("eventTasks", JSON.stringify(updatedTasks));

    // 4. Update Local State & Event Status
    setTasks(newTasks);
    const updatedEvent = { ...event, status: "Confirmed" };
    setEvent(updatedEvent);

    // 5. Persist Event Status Change
    const allEvents = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = allEvents.map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    
    alert(`✅ Event Confirmed! ${newTasks.length} tasks have been auto-generated for the team.`);
  };

  if (!event) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
            <span className={`px-2 py-1 rounded text-xs font-bold ${event.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {event.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{event.date} • {event.type} • {event.guestCount} Guests</p>
        </div>
        
        {event.status === "Draft" && (
          <button onClick={handleConfirmEvent} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition font-semibold cursor-pointer">
            Confirm Event & Generate Tasks
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === "overview" && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Client Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Client Name:</span> <span className="font-medium">{event.client}</span></div>
            <div><span className="text-gray-500">Contact:</span> <span className="font-medium">+91 98765 43210</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">client@example.com</span></div>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No tasks generated yet.</p>
              <p className="text-sm">Confirm the event to generate tasks from the SOP.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{task.title} {task.isMandatory && <span className="text-red-500">*</span>}</td>
                    <td className="px-6 py-4">{task.department}</td>
                    <td className="px-6 py-4">{task.dueDate}</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{task.priority}</span></td>
                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">{task.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "function-sheet" && (
        <FunctionSheetTab event={event} />
      )}
    </AdminLayout>
  );
}