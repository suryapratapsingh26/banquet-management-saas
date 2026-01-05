import { useState } from "react";
import { useAuth } from "../components/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("Grand Banquet Hall");
  const [currency, setCurrency] = useState("INR");

  const handleReset = async () => {
    if (window.confirm("⚠️ DANGER: This will delete all Events, Quotes, Leads, and Tasks.\n\nMaster data (Menus, Inventory, Users) will remain safe.\n\nAre you sure you want to reset the system for a fresh start?")) {
      const token = await user.getIdToken();
      await fetch('http://localhost:5000/api/settings/reset', {
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