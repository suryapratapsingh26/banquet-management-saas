import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Settings() {
  const [property, setProperty] = useState({
    name: "Grand Banquet Hall",
    address: "123, Wedding Street, New Delhi",
    phone: "+91 98765 43210",
    email: "info@grandbanquet.com",
    website: "www.grandbanquet.com",
    gstin: "07AAAAA0000A1Z5"
  });

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Property settings saved successfully!");
    // In a real app, you would make an API call here
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Property Settings</h1>
        <p className="text-gray-500 text-sm">Manage your property details and configuration.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <input name="name" type="text" value={property.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GSTIN</label>
              <input name="gstin" type="text" value={property.gstin} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea name="address" rows="3" value={property.address} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" type="text" value={property.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" type="email" value={property.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700 transition">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}