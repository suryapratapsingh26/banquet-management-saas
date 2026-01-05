import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function BanquetHalls() {
  const { user } = useAuth();
  const canEdit = ['admin', 'Owner', 'Property Admin'].includes(user?.role);

  // Mock Data - In real app, fetch from API
  const [halls, setHalls] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHall, setCurrentHall] = useState({ name: "", type: "Indoor", capacity: "", rate: "" });

  useEffect(() => {
    fetchHalls();
  }, [user]);

  const fetchHalls = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/banquet-halls`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setHalls(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      if (currentHall.id) {
        await fetch(`${API_URL}/api/banquet-halls/${currentHall.id}`, { method: 'PUT', headers, body: JSON.stringify(currentHall) });
      } else {
        await fetch(`${API_URL}/api/banquet-halls`, { method: 'POST', headers, body: JSON.stringify(currentHall) });
      }
      fetchHalls();
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleEdit = (hall) => {
    setCurrentHall(hall);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        const token = await user.getIdToken();
        await fetch(`${API_URL}/api/banquet-halls/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchHalls();
      } catch (error) { console.error(error); }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banquet Halls & Venues</h1>
          <p className="text-gray-500 text-sm">Manage physical spaces, capacities, and base rates.</p>
        </div>
        {canEdit && (
          <button onClick={() => { setCurrentHall({ name: "", type: "Indoor", capacity: "", rate: "" }); setIsModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
            + Add Venue
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div key={hall.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pink-50 rounded-lg text-2xl">
                {hall.type === 'Outdoor' ? '🌳' : hall.type === 'Conference' ? '💼' : '🏰'}
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(hall)} className="text-blue-600 text-xs font-medium hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(hall.id)} className="text-red-600 text-xs font-medium hover:underline cursor-pointer">Delete</button>
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">{hall.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{hall.type} Venue</p>
            
            <div className="flex justify-between items-center text-sm border-t pt-4">
              <div>
                <span className="block text-gray-400 text-xs">Capacity</span>
                <span className="font-semibold text-gray-700">{hall.capacity} Pax</span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-xs">Base Rate</span>
                <span className="font-semibold text-gray-700">₹{parseInt(hall.rate).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{currentHall.id ? 'Edit Venue' : 'Add New Venue'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentHall.name} onChange={e => setCurrentHall({...currentHall, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select className="w-full mt-1 p-2 border rounded" value={currentHall.type} onChange={e => setCurrentHall({...currentHall, type: e.target.value})}>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                  <option>Conference</option>
                  <option>Poolside</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                  <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentHall.capacity} onChange={e => setCurrentHall({...currentHall, capacity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Rate (₹)</label>
                  <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentHall.rate} onChange={e => setCurrentHall({...currentHall, rate: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}