import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', role: 'OPS', department: 'Operations',
    otp: '', shift: 'Morning', salaryType: 'Monthly', aadhaar: '', joiningDate: ''
  });

  const roles = [
    { id: 'SALES', label: 'Sales Executive' },
    { id: 'OPS', label: 'Event Supervisor' },
    { id: 'F_AND_B', label: 'Kitchen Head / F&B' },
    { id: 'FINANCE', label: 'Accountant' },
    { id: 'HOUSEKEEPING', label: 'Floor Incharge' },
    { id: 'SECURITY', label: 'Gate Manager' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Staff Signup:', formData);
    alert('Staff Profile Created! Please wait for Admin approval.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Staff Onboarding</h2>
          <p className="opacity-90">Create your employee profile</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile (Login ID)</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input required name="otp" value={formData.otp} onChange={handleChange} className="w-full border p-2 rounded" placeholder="1234" />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
                {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input required name="department" value={formData.department} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select name="shift" value={formData.shift} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
                <option>Rotational</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
              <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Monthly</option>
                <option>Daily Wage</option>
                <option>Weekly</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar / ID No.</label>
              <input required name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input required type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">Submit Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}