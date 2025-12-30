import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // 3.1 Organization Setup
    companyName: '',
    gstin: '',
    address: '',
    city: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    currency: 'INR',
    taxName: 'GST',
    taxRate: '18',
    fyStart: new Date().toISOString().split('T')[0],

    // 3.2 Property & Venue Setup
    venueName: '',
    venueType: 'Banquet Hall',
    capacityMin: '',
    capacityMax: '',
    seatingStyles: [],
    timeSlots: [],
    rateType: 'Slot-wise',
    basePrice: '',

    // 3.3 Service Configuration
    vegPrice: '',
    nonVegPrice: '',
    decorMinPrice: '',
    addOns: [],

    // 3.4 User & Role Setup
    inviteEmail: '',
    inviteRole: 'SALES',
    invitedUsers: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e, field, value) => {
    const { checked } = e.target;
    setFormData(prev => {
      const list = prev[field] || [];
      if (checked) return { ...prev, [field]: [...list, value] };
      return { ...prev, [field]: list.filter(item => item !== value) };
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.inviteEmail) return;
    const newUser = { email: formData.inviteEmail, role: formData.inviteRole };
    setFormData(prev => ({
      ...prev,
      invitedUsers: [...prev.invitedUsers, newUser],
      inviteEmail: '',
      inviteRole: 'SALES'
    }));
  };

  const handleRemoveUser = (email) => {
    setFormData(prev => ({
      ...prev,
      invitedUsers: prev.invitedUsers.filter(u => u.email !== email)
    }));
  };

  const handleSubmit = async () => {
    // In a real app, you would POST this data to your backend
    console.log("Onboarding Complete:", formData);
    navigate('/dashboard');
  };

  const steps = [
    { id: 1, title: "Organization" },
    { id: 2, title: "Property Setup" },
    { id: 3, title: "Services" },
    { id: 4, title: "Users" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Asyncotel BQT</h1>
          <p className="mt-2 text-gray-600">Let's set up your banquet management system</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center bg-gray-50 px-2 ${step >= s.id ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= s.id ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-300'}`}>
                  {s.id}
                </div>
                <span className="text-xs font-medium mt-2">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          
          {/* Step 1: Organization Setup */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Organization Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input name="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="e.g. Grand Hotels Pvt Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST / Tax ID</label>
                  <input name="gstin" value={formData.gstin} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="GSTIN Number" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Registered Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="Full address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input name="bankName" value={formData.bankName} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IFSC / Swift Code</label>
                  <input name="ifsc" value={formData.ifsc} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Financial Year Start</label>
                  <input type="date" name="fyStart" value={formData.fyStart} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Default Tax %</label>
                    <input name="taxRate" value={formData.taxRate} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="18" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property & Venue Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Primary Venue Setup</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                  <input name="venueName" value={formData.venueName} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="e.g. Royal Ballroom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Venue Type</label>
                  <select name="venueType" value={formData.venueType} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
                    <option>Banquet Hall</option>
                    <option>Lawn</option>
                    <option>Conference Room</option>
                    <option>Resort</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Min Capacity</label>
                    <input type="number" name="capacityMin" value={formData.capacityMin} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                    <input type="number" name="capacityMax" value={formData.capacityMax} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pricing Model</label>
                  <select name="rateType" value={formData.rateType} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2">
                    <option>Slot-wise (Per Shift)</option>
                    <option>Per Pax (Per Plate)</option>
                    <option>Flat Rate (Per Day)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Rate (₹)</label>
                  <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="mt-1 w-full border rounded-md px-3 py-2" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seating Styles Available</label>
                <div className="flex flex-wrap gap-4">
                  {['Theatre', 'Round Table', 'Classroom', 'Buffet', 'U-Shape'].map(style => (
                    <label key={style} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.seatingStyles.includes(style)} onChange={(e) => handleCheckbox(e, 'seatingStyles', style)} className="rounded text-pink-600 focus:ring-pink-500" />
                      <span className="text-sm text-gray-600">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Time Slots</label>
                <div className="flex flex-wrap gap-4">
                  {['Morning (9AM-3PM)', 'Evening (5PM-11PM)', 'Full Day (9AM-11PM)'].map(slot => (
                    <label key={slot} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.timeSlots.includes(slot)} onChange={(e) => handleCheckbox(e, 'timeSlots', slot)} className="rounded text-pink-600 focus:ring-pink-500" />
                      <span className="text-sm text-gray-600">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Service Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Services & Packages</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h3 className="font-medium text-pink-800 mb-3">Food Packages (Base Price)</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600">Veg Plate Price (₹)</label>
                      <input type="number" name="vegPrice" value={formData.vegPrice} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Non-Veg Plate Price (₹)</label>
                      <input type="number" name="nonVegPrice" value={formData.nonVegPrice} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 bg-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3">Decoration & AV</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600">Basic Decor Starting Price (₹)</label>
                      <input type="number" name="decorMinPrice" value={formData.decorMinPrice} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2 bg-white" />
                    </div>
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add-ons Available</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['DJ & Sound', 'Stage Lighting', 'Valet Parking', 'Security', 'Projector/AV'].map(addon => (
                          <label key={addon} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.addOns.includes(addon)} onChange={(e) => handleCheckbox(e, 'addOns', addon)} className="rounded text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-600">{addon}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: User & Role Setup */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Team Setup</h2>
              <p className="text-sm text-gray-500">Invite your team members to manage different aspects of the banquet.</p>

              <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input name="inviteEmail" value={formData.inviteEmail} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" placeholder="colleague@example.com" />
                </div>
                <div className="w-48">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select name="inviteRole" value={formData.inviteRole} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                    <option value="BANQUET_MANAGER">Banquet Manager</option>
                    <option value="SALES">Sales Executive</option>
                    <option value="ACCOUNTS">Accounts</option>
                    <option value="FB_MANAGER">F&B Manager</option>
                    <option value="OPS">Operations</option>
                  </select>
                </div>
                <button onClick={handleAddUser} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
                  Add
                </button>
              </div>

              {formData.invitedUsers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Invited Users</h3>
                  <div className="bg-white border rounded divide-y">
                    {formData.invitedUsers.map((u, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3">
                        <div>
                          <p className="font-medium text-gray-800">{u.email}</p>
                          <p className="text-xs text-gray-500">{u.role}</p>
                        </div>
                        <button onClick={() => handleRemoveUser(u.email)} className="text-red-500 text-sm hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between pt-6 border-t">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className={`px-6 py-2 rounded border ${step === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 shadow-sm"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 shadow-sm font-medium"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}