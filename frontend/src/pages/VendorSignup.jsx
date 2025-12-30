import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VendorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'Decorator',
    contactPerson: '',
    mobile: '',
    email: '',
    locations: '',
    gstNo: '',
    pricingModel: 'Per Event',
    availability: '',
    portfolio: null
  });

  const categories = [
    'Decorator', 'Florist', 'Caterer', 'Tent & Lighting',
    'Sound & DJ', 'Photographer', 'Crockery / Furniture', 'Security Agency'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call would go here
    console.log('Vendor Signup Data:', formData);
    alert('Vendor Application Submitted! We will contact you shortly.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Vendor Partner Registration</h2>
          <p className="opacity-90">Join our network of premium suppliers</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input required name="businessName" value={formData.businessName} onChange={handleChange} className="w-full border p-2 rounded focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded focus:ring-purple-500 focus:border-purple-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Locations (City)</label>
              <input required name="locations" value={formData.locations} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST / PAN</label>
              <input required name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability / Calendar Link</label>
              <input name="availability" value={formData.availability} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. Cal.com link or Notes" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Portfolio (PDF/Images)</label>
              <input type="file" name="portfolio" onChange={handleChange} className="w-full border p-2 rounded bg-gray-50" accept=".pdf,image/*" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model</label>
              <div className="flex space-x-4 mt-1">
                {['Per Event', 'Per Day', 'Commission Based'].map(model => (
                  <label key={model} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="pricingModel" 
                      value={model} 
                      checked={formData.pricingModel === model} 
                      onChange={handleChange}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{model}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button type="button" onClick={() => navigate('/register')} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold">Register Vendor</button>
          </div>
        </form>
      </div>
    </div>
  );
}