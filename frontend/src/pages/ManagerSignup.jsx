import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    role: 'MANAGER', // ADMIN or MANAGER
    shift: 'General',
    reportingTo: '' // Owner or Senior Admin Name
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Manager Signup:', formData);
    alert('Request Sent! Waiting for Owner Approval.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Manager Registration</h2>
          <p className="opacity-90">Operational control & administration</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="ADMIN">Banquet Admin (Full Access)</option>
              <option value="MANAGER">Floor Manager (Ops Access)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role === 'ADMIN' ? 'Can approve bookings & change pricing.' : 'Can manage staff & view schedules.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift Timing</label>
              <select name="shift" value={formData.shift} onChange={handleChange} className="w-full border p-2 rounded">
                <option>General (9-6)</option>
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporting To (Optional)</label>
              <input name="reportingTo" value={formData.reportingTo} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Owner Name" />
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-bold">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}