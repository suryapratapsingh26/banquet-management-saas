import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function StaffSchedule() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [evRes, staffRes, assignRes] = await Promise.all([
        fetch(`${API_URL}/api/events`, { headers }),
        fetch(`${API_URL}/api/users`, { headers }),
        fetch(`${API_URL}/api/staff-assignments`, { headers })
      ]);

      if (evRes.ok) {
        const allEvents = await evRes.json();
        setEvents(allEvents.filter(e => e.status === "Upcoming" || e.status === "Confirmed"));
      }
      if (staffRes.ok) setStaff(await staffRes.json());
      if (assignRes.ok) setAssignments(await assignRes.json());
    };
    fetchData();
  }, [user]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !selectedStaff) return;

    const event = events.find(ev => ev.id === parseInt(selectedEvent));
    const staffMember = staff.find(s => s.id === parseInt(selectedStaff));

    const newAssignment = {
      event_id: event.id,
      event_title: event.title,
      event_date: event.date,
      staff_id: staffMember.id,
      staff_name: staffMember.name,
      staff_role: staffMember.role
    };

    const token = await user.getIdToken();
    await fetch(`${API_URL}/api/staff-assignments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newAssignment)
    });
    
    // Refresh logic omitted for brevity, assume reload or refetch
    window.location.reload();
    setSelectedStaff("");
  };
  const handleRemove = async (id) => {
    try {
      const token = await user.getIdToken();
      await fetch(`${API_URL}/api/staff-assignments/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      // Optimistic update
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Scheduling</h1>
        <p className="text-gray-500 text-sm">Assign staff to upcoming events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assignment Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Assign Shift</h3>
          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Event</label>
              <select className="w-full mt-1 p-2 border rounded" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} required>
                <option value="">-- Choose Event --</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.title} ({e.date})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Staff</label>
              <select className="w-full mt-1 p-2 border rounded" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} required>
                <option value="">-- Choose Staff --</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name} - {s.role}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition cursor-pointer">Assign Staff</button>
          </form>
        </div>

        {/* Roster View */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-800">Duty Roster</h3>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Staff Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{a.event_title}</td>
                  <td className="px-6 py-4">{a.event_date ? a.event_date.split('T')[0] : ''}</td>
                  <td className="px-6 py-4">{a.staff_name}</td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{a.staff_role}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleRemove(a.id)} className="text-red-600 hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No shifts assigned yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}