import StatCard from "./StatCard";
import { useNavigate } from "react-router-dom";

export default function EventCoordinationDashboard() {
  // Mock Data for Event Status Bar
  const departments = [
    { name: "Sales", status: "Completed", color: "bg-green-500" },
    { name: "Ops", status: "In Progress", color: "bg-yellow-500" },
    { name: "F&B", status: "Completed", color: "bg-green-500" },
    { name: "Kitchen", status: "In Progress", color: "bg-yellow-500" },
    { name: "Accounts", status: "Pending", color: "bg-red-500" },
  ];

  const navigate = useNavigate();

  // Mock Data for Timeline
  const timelineEvents = [
    { time: "10:00", task: "Hall Setup", status: "Done" },
    { time: "12:00", task: "Food Prep", status: "In Progress" },
    { time: "18:00", task: "Guest Arrival", status: "Pending" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Event Coordination Center</h1>
            <p className="text-gray-500">Amit & Neha Wedding | 12 Aug | Emerald Hall</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-500">Event Status</span>
            <div className="flex gap-2 mt-1">
              {departments.map((dept) => (
                <div key={dept.name} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                  <span className="text-xs text-gray-600">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Tasks Pending" value="15" />
        <StatCard title="Tasks Delayed" value="3" />
        <StatCard title="Depts at Risk" value="Kitchen" />
        <StatCard title="Hours to Start" value="4.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-semibold text-gray-700 mb-4">Today's Timeline</h3>
          <div className="space-y-6 relative border-l-2 border-gray-200 ml-3 pl-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative">
                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ${event.status === 'Done' ? 'bg-green-500' : event.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                <p className="text-sm font-bold text-gray-800">{event.time}</p>
                <p className="text-sm text-gray-600">{event.task}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${event.status === 'Done' ? 'bg-green-100 text-green-800' : event.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Overview (Placeholder for TaskManagement component integration) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Critical Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="text-pink-600 text-sm font-medium hover:underline">View All Tasks</button>
          </div>
          <div className="space-y-3">
             {/* Mock Critical Tasks */}
             {['Stage Decor Final Touch', 'Welcome Drinks Setup', 'AV Sound Check'].map((task, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <div className="flex items-center gap-3">
                   <input type="checkbox" className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                   <span className="text-sm text-gray-700">{task}</span>
                 </div>
                 <span className="text-xs text-red-500 font-medium">High Priority</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}