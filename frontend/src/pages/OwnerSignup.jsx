import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULES } from '../RoleAccessMaster';
import { registerOwner } from '../services/api';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: '', mobile: '', email: '', preferredLanguage: 'English',
    idProof: null, hallName: '', legalEntity: '', numHalls: '', hallType: 'Indoor', gstNo: '', city: '', state: '', country: '', mapLocation: '', capacityMin: '', capacityMax: '', 
    yearEst: '', parking: '', address: '',
    bankAccount: '', ifsc: '', pan: '',
    pricing: { perPlate: false, rental: false, decoration: false, commission: false },
    modules: { 
      [MODULES.BOOKINGS]: true, 
      [MODULES.CRM]: false, 
      [MODULES.INVENTORY]: false, 
      [MODULES.KITCHEN]: false, 
      [MODULES.FINANCE]: false, 
      [MODULES.STAFF]: false, 
      [MODULES.VENDOR]: false, 
      [MODULES.APP]: false, 
      [MODULES.ANALYTICS]: false 
    },
    plan: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleModuleToggle = (mod) => {
    setFormData(prev => ({
      ...prev,
      modules: { ...prev.modules, [mod]: !prev.modules[mod] }
    }));
  };

  const handlePricingToggle = (mode) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [mode]: !prev.pricing[mode] }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting Owner Signup:', formData);
      await registerOwner(formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration Failed:', error);
      alert(error.response?.data?.error || 'Registration Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-pink-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Partner Registration</h2>
          <p className="opacity-90">Step {step} of 4: {step === 1 ? 'Owner Details' : step === 2 ? 'Property Details' : step === 3 ? 'Bank & Business' : 'Plan & Modules'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Step 1: Owner Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input required name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full border p-2 rounded">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Regional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID Proof (Aadhaar/Passport)</label>
                <input type="file" name="idProof" onChange={handleChange} className="w-full border p-2 rounded bg-gray-50" accept="image/*,.pdf" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP (Sent to Mobile)</label>
                <input name="otp" className="w-full border p-2 rounded" placeholder="1234" />
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 mt-4">Next: Property Details</button>
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banquet Hall Name</label>
                <input required name="hallName" value={formData.hallName} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal Entity Name</label>
                <input required name="legalEntity" value={formData.legalEntity} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Registered Company Name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST No.</label>
                  <input required name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input required name="country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address / Map Location</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Map Link</label>
                <input name="mapLocation" value={formData.mapLocation} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://maps.google.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" name="yearEst" placeholder="Year Est." value={formData.yearEst} onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="number" name="parking" placeholder="Parking Capacity" value={formData.parking} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Halls</label>
                  <input type="number" name="numHalls" value={formData.numHalls} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="hallType" value={formData.hallType} onChange={handleChange} className="w-full border p-2 rounded">
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
                  <input type="number" name="capacityMin" value={formData.capacityMin} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                  <input type="number" name="capacityMax" value={formData.capacityMax} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Next: Business Info</button>
              </div>
            </div>
          )}

          {/* Step 3: Bank & Pricing */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-800">Bank Details (For Payouts)</h3>
              <div className="grid grid-cols-2 gap-4">
                <input required name="bankAccount" placeholder="Account Number" value={formData.bankAccount} onChange={handleChange} className="w-full border p-2 rounded" />
                <input required name="ifsc" placeholder="IFSC Code" value={formData.ifsc} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <input required name="pan" placeholder="PAN Number" value={formData.pan} onChange={handleChange} className="w-full border p-2 rounded" />
              
              <h3 className="font-semibold text-gray-800 mt-4">Pricing Models</h3>
              <div className="space-y-2">
                {['perPlate', 'rental', 'decoration', 'commission'].map(mode => (
                  <label key={mode} className="flex items-center space-x-3">
                    <input type="checkbox" checked={formData.pricing[mode]} onChange={() => handlePricingToggle(mode)} className="w-4 h-4 text-pink-600" />
                    <span className="capitalize">{mode.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Back</button>
                <button type="button" onClick={() => setStep(4)} className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Next: Plans</button>
              </div>
            </div>
          )}

          {/* Step 4: Plan & Modules */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-800">Select Plan</h3>
              <select name="plan" value={formData.plan} onChange={handleChange} className="w-full border p-2 rounded mb-4">
                <option value="">-- Choose a Plan --</option>
                <option value="basic">Basic (Event Booking Only)</option>
                <option value="pro">Pro (Booking + CRM + Vendor)</option>
                <option value="enterprise">Enterprise (All Modules)</option>
              </select>

              <h3 className="font-semibold text-gray-800">Select Modules</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(formData.modules).map(mod => (
                  <label key={mod} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={formData.modules[mod]} onChange={() => handleModuleToggle(mod)} className="w-4 h-4 text-pink-600" />
                    <span className="text-sm capitalize">{mod.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">Back</button>
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Complete Registration</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}