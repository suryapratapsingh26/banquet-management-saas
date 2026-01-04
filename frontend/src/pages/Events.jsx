import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(savedEvents);
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Operations</h1>
        <p className="text-gray-500 text-sm">Manage upcoming events and function sheets.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event Title</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">PAX</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4">{event.pax}</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{event.status}</span></td>
                <td className="px-6 py-4 text-right"><Link to={`/events/${event.id}`} className="text-pink-600 hover:underline font-medium">View Function Sheet</Link></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No confirmed events yet. Confirm a quote to see it here.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}