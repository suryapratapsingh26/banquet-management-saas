import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [quote, setQuote] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch Event
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const foundEvent = events.find(e => e.id === parseInt(id));
    
    if (foundEvent) {
      setEvent(foundEvent);
      
      // 2. Fetch Package & Dishes to build the Menu
      const packages = JSON.parse(localStorage.getItem("packages")) || [];
      const dishes = JSON.parse(localStorage.getItem("dishes")) || [];
      
      const pkg = packages.find(p => p.id === foundEvent.packageId);
      if (pkg) {
        const items = pkg.selectedDishIds.map(dishId => dishes.find(d => d.id === dishId)).filter(Boolean);
        setMenuItems(items);
      }

      // 3. Fetch Inventory
      const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
      setInventory(savedInventory);

      // 4. Fetch Quote for Revenue
      const quotes = JSON.parse(localStorage.getItem("quotations")) || [];
      const foundQuote = quotes.find(q => q.id === foundEvent.quoteId);
      setQuote(foundQuote);
    }
  }, [id]);

  const handleDeductInventory = () => {
    if (event.inventoryDeducted) return;
    if (!window.confirm(`This will deduct ingredients for ${event.pax} PAX from the Main Store. Proceed?`)) return;

    let updatedInventory = [...inventory];
    
    menuItems.forEach(dish => {
      if (dish.ingredients) {
        dish.ingredients.forEach(ing => {
          const totalNeeded = ing.qty * event.pax;
          const stockIndex = updatedInventory.findIndex(i => i.id === ing.id);
          
          if (stockIndex > -1) {
            // Deduct stock (prevent negative for now, or allow it to show deficit)
            updatedInventory[stockIndex].quantity = Math.max(0, updatedInventory[stockIndex].quantity - totalNeeded);
          }
        });
      }
    });

    // Save Updates
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    setInventory(updatedInventory);

    // Update Event Status
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = events.map(e => e.id === event.id ? { ...e, inventoryDeducted: true, status: "Completed" } : e);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    
    setEvent({ ...event, inventoryDeducted: true, status: "Completed" });
    alert("Inventory deducted successfully! Stock levels updated.");
  };

  if (!event) return <AdminLayout>Loading...</AdminLayout>;

  // Calculate Forecast
  const ingredientTotals = {};
  menuItems.forEach(dish => {
    if (dish.ingredients) {
      dish.ingredients.forEach(ing => {
        if (!ingredientTotals[ing.id]) ingredientTotals[ing.id] = { ...ing, totalNeeded: 0 };
        ingredientTotals[ing.id].totalNeeded += (ing.qty * event.pax);
      });
    }
  });
  const forecastList = Object.values(ingredientTotals);

  // Calculate Financials (Real-time based on current inventory prices)
  const totalRevenue = quote ? parseFloat(quote.totalAmount) : 0;
  
  let realTimeFoodCost = 0;
  forecastList.forEach(ing => {
      const stockItem = inventory.find(i => i.id === ing.id);
      const price = stockItem ? parseFloat(stockItem.unitPrice || 0) : 0;
      realTimeFoodCost += (ing.totalNeeded * price);
  });

  const grossProfit = totalRevenue - realTimeFoodCost;
  const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Audit Logic
  const [auditForm, setAuditForm] = useState({
    cleanliness: false,
    staffUniform: false,
    avCheck: false,
    foodTemp: false,
    fireSafety: false
  });

  const handleSaveAudit = (e) => {
    e.preventDefault();
    const isPassed = Object.values(auditForm).every(val => val === true);
    const status = isPassed ? "Passed" : "Failed";
    
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const updatedEvents = events.map(e => e.id === event.id ? { ...e, auditStatus: status } : e);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    
    setEvent({ ...event, auditStatus: status });
    setIsAuditModalOpen(false);
    
    if(isPassed) alert("✅ Audit Passed! Event is ready to go live.");
    else alert("❌ Audit Failed. Please rectify issues and re-audit.");
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/events")} className="text-gray-500 hover:text-gray-700">← Back</button>
            <h1 className="text-2xl font-bold text-gray-800">Banquet Event Order (BEO)</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">Function Sheet #{event.id}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsAuditModalOpen(true)} className={`px-4 py-2 rounded shadow text-white ${event.auditStatus === 'Passed' ? 'bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}>{event.auditStatus === 'Passed' ? 'Audit Passed ✅' : '📋 Conduct Audit'}</button>
          <button onClick={() => window.print()} className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700">Print BEO</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Event Details</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-500 block">Event Title</span><span className="font-medium">{event.title}</span></div>
            <div><span className="text-gray-500 block">Date</span><span className="font-medium">{event.date}</span></div>
            <div><span className="text-gray-500 block">Guaranteed PAX</span><span className="font-medium text-xl text-pink-600">{event.pax}</span></div>
            <div><span className="text-gray-500 block">Status</span><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Confirmed</span></div>
            <div><span className="text-gray-500 block">Audit</span><span className={`px-2 py-1 rounded text-xs font-bold ${event.auditStatus === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{event.auditStatus || 'Pending'}</span></div>
          </div>
        </div>

        {/* Menu Plan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">F&B Production Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Starters & Appetizers</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {menuItems.filter(i => i.category === 'Starter').map(i => <li key={i.id}>{i.name}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Main Course</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {menuItems.filter(i => i.category === 'Main Course').map(i => <li key={i.id}>{i.name}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Desserts & Beverages</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {menuItems.filter(i => ['Dessert', 'Beverage'].includes(i.category)).map(i => <li key={i.id}>{i.name}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
            <strong>Kitchen Note:</strong> Please ensure food is ready 30 mins before service time.
          </div>
        </div>

        {/* Inventory Forecast Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Raw Material Consumption Forecast</h3>
            {!event.inventoryDeducted ? (
              <button onClick={handleDeductInventory} className="bg-pink-600 text-white px-4 py-2 rounded shadow hover:bg-pink-700 text-sm font-medium cursor-pointer">
                📉 Deduct from Inventory
              </button>
            ) : (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-medium">Inventory Deducted ✅</span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr><th>Ingredient</th><th>Qty Per Plate</th><th>Total Required ({event.pax} PAX)</th><th>Current Stock</th><th>Status</th></tr>
              </thead>
              <tbody>
                {forecastList.map((ing, idx) => {
                  const stockItem = inventory.find(i => i.id === ing.id);
                  const currentStock = stockItem ? stockItem.quantity : 0;
                  const isDeficit = currentStock < ing.totalNeeded;
                  return (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2 font-medium">{ing.name}</td>
                      <td className="px-4 py-2">{ing.qty} {ing.unit}</td>
                      <td className="px-4 py-2 font-bold">{ing.totalNeeded.toFixed(2)} {ing.unit}</td>
                      <td className="px-4 py-2">{currentStock.toFixed(2)} {ing.unit}</td>
                      <td className="px-4 py-2">
                        {isDeficit ? <span className="text-red-600 font-bold">Deficit</span> : <span className="text-green-600">Available</span>}
                      </td>
                    </tr>
                  );
                })}
                {forecastList.length === 0 && <tr><td colSpan="5" className="p-4 text-center">No ingredients linked to this menu.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profitability Report */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">💰 Post-Event Profitability Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Total Food Cost</p>
              <p className="text-2xl font-bold text-red-700">₹{realTimeFoodCost.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Gross Profit</p>
              <p className="text-2xl font-bold text-green-700">₹{grossProfit.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Net Margin</p>
              <p className="text-2xl font-bold text-blue-700">{profitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pre-Event Quality Audit</h2>
            <form onSubmit={handleSaveAudit} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" checked={auditForm.cleanliness} onChange={e => setAuditForm({...auditForm, cleanliness: e.target.checked})} />
                  <span className="text-gray-700">Hall Cleanliness & Setup</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" checked={auditForm.staffUniform} onChange={e => setAuditForm({...auditForm, staffUniform: e.target.checked})} />
                  <span className="text-gray-700">Staff Grooming & Uniforms</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" checked={auditForm.avCheck} onChange={e => setAuditForm({...auditForm, avCheck: e.target.checked})} />
                  <span className="text-gray-700">AV & Sound Check</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" checked={auditForm.foodTemp} onChange={e => setAuditForm({...auditForm, foodTemp: e.target.checked})} />
                  <span className="text-gray-700">Food Temperature Check</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-pink-600" checked={auditForm.fireSafety} onChange={e => setAuditForm({...auditForm, fireSafety: e.target.checked})} />
                  <span className="text-gray-700">Fire Safety & Exits Clear</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Submit Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}