import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    // Filter only confirmed events for availability check
    setEvents(savedEvents.filter(e => e.status === "Confirmed"));
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Availability Calendar</h1>
          <p className="text-gray-500 text-sm">View bookings and hall availability.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <button onClick={() => changeMonth(-1)} className="text-gray-600 hover:text-pink-600 font-bold cursor-pointer">←</button>
          <span className="font-bold text-gray-800 w-32 text-center">{monthNames[month]} {year}</span>
          <button onClick={() => changeMonth(1)} className="text-gray-600 hover:text-pink-600 font-bold cursor-pointer">→</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 border-b border-r bg-gray-50/30"></div>
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div key={day} className={`h-32 border-b border-r p-2 transition hover:bg-gray-50 ${isToday ? 'bg-pink-50/30' : ''}`}>
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-pink-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-24">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate" title={ev.name}>
                      {ev.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty cells for next month to fill grid (optional, keeping simple for now) */}
        </div>
      </div>
    </AdminLayout>
  );
}