import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    secretKey: '', // Security measure for root access
    designation: 'Super Admin'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.secretKey !== 'ASYNC-ROOT-2025') { // Mock validation
      alert('Invalid Secret Key! Access Denied.');
      return;
    }
    console.log('Super Admin Signup:', formData);
    alert('Root Access Granted. Welcome, Super Admin.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-800 p-6 text-white border-b border-gray-700">
          <h2 className="text-2xl font-bold text-red-500">⚠️ Super Admin Access</h2>
          <p className="opacity-70 text-sm">Restricted Area: Platform Controllers Only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded border border-red-100">
            <label className="block text-sm font-bold text-red-800 mb-1">Master Secret Key</label>
            <input 
              required 
              type="password" 
              name="secretKey" 
              value={formData.secretKey} 
              onChange={handleChange} 
              className="w-full border p-2 rounded focus:ring-red-500 focus:border-red-500" 
              placeholder="Enter root key..." 
            />
          </div>

          <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded hover:bg-black font-bold transition-colors">Authenticate & Register</button>
          <button type="button" onClick={() => navigate('/register')} className="w-full text-gray-500 text-sm hover:underline">Cancel</button>
        </form>
      </div>
    </div>
  );
}