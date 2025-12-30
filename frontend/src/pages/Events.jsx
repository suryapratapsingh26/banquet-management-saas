import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AddEventModal from "../components/AddEventModal";

export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    { id: 1, eventName: "Rohit & Priya Wedding", clientName: "Rohit Sharma", date: "2023-11-15", hall: "Crystal Ballroom", timeSlot: "Evening Shift", status: "Draft", pax: 500, eventType: "Wedding" },
    { id: 2, eventName: "Tech Corp Annual Meet", clientName: "Tech Corp", date: "2023-11-20", hall: "Grand Hall", timeSlot: "Morning Shift", status: "Confirmed", pax: 200, eventType: "Corporate" },
  ]);

  const handleSave = (data) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === data.id ? data : e));
    } else {
      setEvents([...events, { ...data, id: Date.now(), status: "Draft" }]);
    }
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-yellow-100 text-yellow-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-500 text-sm">Manage bookings and event lifecycles.</p>
        </div>
        <button onClick={openAdd} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition">
          + Create Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Event Name</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Hall & Slot</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{event.eventName}<br/><span className="text-xs text-gray-400">{event.eventType} • {event.pax} Pax</span></td>
                <td className="px-6 py-4">{event.clientName}</td>
                <td className="px-6 py-4">{event.hall}<br/><span className="text-xs text-gray-400">{event.timeSlot}</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>{event.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => navigate(`/events/${event.id}`)} className="text-pink-600 hover:underline mr-4 font-medium">
                    Manage
                  </button>
                  <button onClick={() => openEdit(event)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} onSave={handleSave} existingEvent={editingEvent} />}
    </AdminLayout>
  );
}