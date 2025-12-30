import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCoSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    experience: '',
    teamSize: '',
    cities: '',
    gstNo: '',
    eventTypes: []
  });

  const eventOptions = ['Weddings', 'Corporate', 'Concerts', 'Exhibitions', 'Private Parties'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (type) => {
    setFormData(prev => {
      const newTypes = prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type];
      return { ...prev, eventTypes: newTypes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event Co Signup:', formData);
    alert('Registration Successful! Welcome Partner.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-orange-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Event Company Registration</h2>
          <p className="opacity-90">Manage multiple clients & bulk bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cities Covered</label>
              <input required name="cities" value={formData.cities} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. Mumbai, Pune" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
              <input required name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Specializations</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {eventOptions.map(type => (
                  <label key={type} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.eventTypes.includes(type)} 
                      onChange={() => handleCheckbox(type)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 font-bold">Register Company</button>
          </div>
        </form>
      </div>
    </div>
  );
}