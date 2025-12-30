import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InternalSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    department: 'Sales',
    role: 'Executive'
  });

  const departments = ['Sales', 'Support', 'Accounts', 'Product', 'Operations'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Internal Team Signup:', formData);
    alert('Employee Profile Created! Please check email for credentials.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-cyan-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Asyncotel Team Portal</h2>
          <p className="opacity-90">Internal Staff Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input required name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full border p-2 rounded" placeholder="EMP-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" placeholder="@asyncotel.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full border p-2 rounded">
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Level</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Intern">Intern</option>
                <option value="Executive">Executive</option>
                <option value="Manager">Manager</option>
                <option value="Head">Head of Dept</option>
              </select>
            </div>
          </div>

          <div className="bg-cyan-50 p-3 rounded text-xs text-cyan-800">
            Note: Access permissions will be auto-assigned based on Department and Role selection.
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800 font-bold">Register Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}