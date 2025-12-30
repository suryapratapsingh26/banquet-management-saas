import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState("October 2025");
  
  // Mock Data matching Dashboard
  const events = [
    { id: 1, title: "Sharma Wedding", date: 24, type: "Wedding", status: "Confirmed", color: "bg-green-100 text-green-800 border-green-200" },
    { id: 2, title: "Tech Corp Seminar", date: 26, type: "Corporate", status: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { id: 3, title: "Kapoor Reception", date: 14, type: "Reception", status: "Confirmed", color: "bg-green-100 text-green-800 border-green-200" },
    { id: 4, title: "Birthday Bash", date: 5, type: "Social", status: "Tentative", color: "bg-orange-100 text-orange-800 border-orange-200" },
  ];

  // Simple calendar grid generator for Oct 2025 (Starts Wednesday)
  const daysInMonth = 31;
  const startDayOffset = 3; // 0=Sun, 1=Mon, 2=Tue, 3=Wed
  
  const calendarSlots = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarSlots.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarSlots.push(i);
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Availability Calendar</h1>
          <p className="text-gray-500 text-sm">View bookings, blocked dates, and available slots.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-50">Month View</button>
            <button className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700">+ Add Booking</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <button className="p-2 hover:bg-gray-200 rounded-full">←</button>
            <h2 className="text-lg font-bold text-gray-700">{currentMonth}</h2>
            <button className="p-2 hover:bg-gray-200 rounded-full">→</button>
        </div>
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-2 text-center text-sm font-semibold text-gray-500 border-r last:border-r-0">
                    {day}
                </div>
            ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b">
            {calendarSlots.map((day, index) => {
                const dayEvents = day ? events.filter(e => e.date === day) : [];
                return (
                    <div key={index} className={`min-h-[120px] bg-white p-2 ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}`}>
                        {day && (
                            <>
                                <span className={`text-sm font-medium ${dayEvents.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {day}
                                </span>
                                <div className="mt-1 space-y-1">
                                    {dayEvents.map(ev => (
                                        <div key={ev.id} className={`text-xs p-1.5 rounded border ${ev.color} truncate shadow-sm`}>
                                            {ev.title}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </AdminLayout>
  );
}