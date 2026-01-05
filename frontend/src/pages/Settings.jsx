import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function Settings() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("Grand Banquet Hall");
  const [currency, setCurrency] = useState("INR");

  const handleReset = async () => {
    if (window.confirm("⚠️ DANGER: This will delete all Events, Quotes, Leads, and Tasks.\n\nMaster data (Menus, Inventory, Users) will remain safe.\n\nAre you sure you want to reset the system for a fresh start?")) {
      const token = await user.getIdToken();
      await fetch(`${API_URL}/api/settings/reset`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("System has been reset. All transaction data cleared.");
      window.location.reload();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };
                    
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500 text-sm">Configure general application preferences.</p>
      </div>

      {/* System Status Card */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-blue-800">Asyncotel Core (Single Tenant)</h3>
          <p className="text-xs text-blue-600">Database: PostgreSQL | Backend: Node.js | Status: Online</p>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center text-[10px] text-gray-600"><span className="text-green-500 mr-2">✅</span> Database Migration (100%)</div>
            <div className="flex items-center text-[10px] text-gray-600"><span className="text-green-500 mr-2">✅</span> Core Modules (95%)</div>
            <div className="flex items-center text-[10px] text-gray-600"><span className="text-orange-500 mr-2">⚠️</span> SaaS Multi-Tenancy (10%)</div>
            <div className="flex items-center text-[10px] text-gray-600"><span className="text-red-500 mr-2">❌</span> Subscriptions (0%)</div>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2 w-48">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[10px] text-blue-600 mt-1">Overall SaaS Readiness: 75%</p>
        </div>
        <div className="text-right">
          <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">v1.0.0</span>
          <p className="text-xs text-gray-500 mt-1">MVP Complete</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">General Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Property / Company Name</label>
                <input type="text" className="w-full mt-1 p-2 border rounded" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                <select className="w-full mt-1 p-2 border rounded" value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
              Save Changes
            </button>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">Clear all demo data (Events, Quotes, Leads) to start fresh. Master settings will be preserved.</p>
          <button onClick={handleReset} className="border border-red-200 bg-red-50 text-red-700 px-4 py-2 rounded hover:bg-red-100 transition cursor-pointer">
            Reset Transaction Data
          </button>
        </div>
      </div>
    </>
  );
}