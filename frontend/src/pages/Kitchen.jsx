import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Kitchen() {
  const { user } = useAuth();
  const { token } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productionData, setProductionData] = useState({ events: [], packages: [] });
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchProductionData();
    fetchDishes();
  }, [user, date, token]);

  const fetchDishes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/masters/menu-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setDishes(await res.json());
    } catch (error) { console.error(error); }
  };

  const fetchProductionData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/kitchen/production?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProductionData(await res.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  // Aggregate Data
  const aggregatedItems = {};
  
  productionData.events.forEach(event => {
    const pkg = productionData.packages.find(p => p.id === event.packageId);
    if (pkg && pkg.items) {
      // Assuming items is stored as { "Starters": ["Item1"], ... }
      Object.values(pkg.items).flat().forEach(itemName => {
        const dish = dishes.find(d => d.name === itemName);
        if (dish) {
          if (!aggregatedItems[dish.id]) {
            aggregatedItems[dish.id] = { ...dish, totalPax: 0, events: [] };
          }
          aggregatedItems[dish.id].totalPax += event.guests;
          aggregatedItems[dish.id].events.push(`${event.title} (${event.guests})`);
        }
      });
    }
  });

  const productionList = Object.values(aggregatedItems);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kitchen Production Sheet</h1>
          <p className="text-gray-500 text-sm">Daily food preparation requirements.</p>
        </div>
        <div>
          <input 
            type="date" 
            className="border p-2 rounded shadow-sm" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>
      </div>

      {loading ? <div className="text-center p-10">Loading...</div> : (
        <div className="grid grid-cols-1 gap-6">
          {/* Summary Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">Day Summary</h3>
            <p className="text-sm text-gray-600">Total Events: <span className="font-bold">{productionData.events.length}</span></p>
            <p className="text-sm text-gray-600">Total PAX: <span className="font-bold">{productionData.events.reduce((sum, e) => sum + e.guests, 0)}</span></p>
          </div>

          {/* Production Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Dish Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Total Quantity (PAX)</th>
                  <th className="px-6 py-3">Events</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {productionList.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-pink-600">{item.totalPax}</td>
                    <td className="px-6 py-4 text-xs">{item.events.join(", ")}</td>
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4" /> <span className="ml-2">Prepared</span>
                    </td>
                  </tr>
                ))}
                {productionList.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No food production scheduled for this date.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}