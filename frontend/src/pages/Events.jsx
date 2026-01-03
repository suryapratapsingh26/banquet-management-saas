import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Events() {
  const { user } = useAuth();
  // Only Sales & Admin can create new bookings
  const canCreate = ['Sales Manager', 'Sales Executive', 'admin', 'Banquet Manager', 'Owner'].includes(user?.role);

  // Mock Data - In real app, fetch from API
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rahul & Priya Wedding", type: "Wedding", date: "2025-12-01", status: "Draft", guestCount: 500, client: "Rahul Verma" },
      { id: 2, name: "TechCorp Annual Meet", type: "Corporate", date: "2025-11-15", status: "Confirmed", guestCount: 120, client: "Amit Singh" },
      { id: 3, name: "Shanaya's 5th Birthday", type: "Birthday", date: "2025-10-20", status: "Draft", guestCount: 80, client: "Mrs. Kapoor" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", type: "Wedding", date: "", guestCount: "", client: "" });

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { ...newEvent, id: Date.now(), status: "Draft" }]);
    setIsModalOpen(false);
    setNewEvent({ name: "", type: "Wedding", date: "", guestCount: "", client: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-700";
      case "Draft": return "bg-gray-100 text-gray-700";
      case "Completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-500 text-sm">Manage bookings and event statuses.</p>
        </div>
        {canCreate && (
          <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + New Booking
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event Name</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4">{event.type}</td>
                <td className="px-6 py-4">{event.client}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(event.status)}`}>{event.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/events/${event.id}`} className="text-pink-600 hover:underline font-medium">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">New Booking</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={newEvent.client} onChange={e => setNewEvent({...newEvent, client: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select className="w-full mt-1 p-2 border rounded" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" required className="w-full mt-1 p-2 border rounded" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guest Count</label>
                <input type="number" required className="w-full mt-1 p-2 border rounded" value={newEvent.guestCount} onChange={e => setNewEvent({...newEvent, guestCount: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Create Draft</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}