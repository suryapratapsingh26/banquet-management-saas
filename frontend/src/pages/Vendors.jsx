import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Vendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState({ vendorId: "", score: 5, comment: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_URL}/api/vendors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [user]);

  const handleRate = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      await fetch(`${API_URL}/api/vendors/${currentRating.vendorId}/rate`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ score: currentRating.score })
      });
      
      // Refresh list
      const response = await fetch(`${API_URL}/api/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVendors(data);
      
      setIsModalOpen(false);
      alert("Vendor rating submitted successfully!");
    } catch (error) {
      console.error("Error rating vendor:", error);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
        <p className="text-gray-500 text-sm">Manage vendor partners and track performance.</p>
      </div>

      {loading ? <div className="text-center p-10">Loading Vendors...</div> : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Performance Score</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
                <td className="px-6 py-4">{v.category}</td>
                <td className="px-6 py-4">{v.contact}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`text-lg font-bold mr-2 ${getRatingColor(v.rating)}`}>{v.rating || "N/A"}</span>
                    <span className="text-xs text-gray-400">({v.reviews || 0} reviews)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setCurrentRating({ vendorId: v.id, score: 5, comment: "" }); setIsModalOpen(true); }}
                    className="text-pink-600 hover:underline font-medium"
                  >
                    Rate Performance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rate Vendor Performance</h2>
            <form onSubmit={handleRate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Score (1-5)</label>
                <select className="w-full mt-1 p-2 border rounded" value={currentRating.score} onChange={e => setCurrentRating({...currentRating, score: e.target.value})}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea className="w-full mt-1 p-2 border rounded" rows="3" value={currentRating.comment} onChange={e => setCurrentRating({...currentRating, comment: e.target.value})} placeholder="e.g. Delivered on time, good quality..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Submit Rating</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}