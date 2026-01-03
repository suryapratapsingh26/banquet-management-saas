import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../components/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("Grand Banquet Hall");
  const [currency, setCurrency] = useState("INR");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  return (
    <AdminLayout>
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
      </div>
    </AdminLayout>
  );
}