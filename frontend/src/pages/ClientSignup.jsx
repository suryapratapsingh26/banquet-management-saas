import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    eventDate: '',
    eventType: 'Wedding',
    guestCount: '',
    budget: '',
    preferences: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client Signup:', formData);
    alert('Account Created! You can now browse venues.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Plan Your Event</h2>
          <p className="opacity-90">Sign up to book venues & vendors</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input required name="otp" value={formData.otp} onChange={handleChange} className="w-full border p-2 rounded" placeholder="1234" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Engagement</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
              <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Approx)</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferences / Special Requests</label>
            <textarea name="preferences" value={formData.preferences} onChange={handleChange} className="w-full border p-2 rounded" rows="3" placeholder="e.g. Jain Food, Wheelchair access required..."></textarea>
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-700 font-bold">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}