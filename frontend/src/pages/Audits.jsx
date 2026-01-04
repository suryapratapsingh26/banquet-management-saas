import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Link } from "react-router-dom";

export default function Audits() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    // Filter for active events (Upcoming or Confirmed)
    const activeEvents = savedEvents.filter(e => e.status !== "Draft" && e.status !== "Cancelled");
    setEvents(activeEvents);
  }, []);

  const getAuditStatus = (event) => {
    if (event.auditStatus === "Passed") return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Passed ✅</span>;
    if (event.auditStatus === "Failed") return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Failed ❌</span>;
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>;
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Audit & Compliance</h1>
        <p className="text-gray-500 text-sm">Ensure quality standards before events go live.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Event Date</th>
              <th className="px-6 py-3">Event Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Audit Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                <td className="px-6 py-4">Wedding</td> {/* Placeholder for type */}
                <td className="px-6 py-4">{getAuditStatus(event)}</td>
                <td className="px-6 py-4 text-right"><Link to={`/events/${event.id}`} className="text-blue-600 hover:underline font-medium">Conduct Audit</Link></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No active events found.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}