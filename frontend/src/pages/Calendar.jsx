import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Calendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEvents(await res.json());
    };
    fetchEvents();
  }, [user]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-100"></div>);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr && e.status !== 'Cancelled');

      days.push(
        <div key={day} className="h-32 bg-white border border-gray-200 p-2 overflow-y-auto hover:bg-gray-50 transition relative group">
          <div className="font-bold text-gray-700 mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.map(ev => (
              <div 
                key={ev.id} 
                onClick={() => navigate(`/events/${ev.id}`)}
                className={`text-xs p-1 rounded cursor-pointer truncate ${ev.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                title={ev.title}
              >
                {ev.title}
              </div>
            ))}
          </div>
          {/* Quick Add Button on Hover */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/quotations'); }}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm"
          >
            +
          </button>
        </div>
      );
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Venue Calendar</h1>
          <p className="text-gray-500 text-sm">View bookings and availability.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded text-gray-600">←</button>
          <span className="font-bold text-gray-800 w-32 text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded text-gray-600">→</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-sm font-bold text-gray-500 uppercase">{d}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </div>
    </>
  );
}