import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", clientType: "Standalone Banquet Hall",
    businessName: "", gstNumber: "", city: "", address: "",
    venueType: "Banquet Hall", capacityMin: "", capacityMax: ""
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("userName", formData.fullName || "New User");
    if (profilePhoto) localStorage.setItem("userPhoto", profilePhoto);
    // Navigate to dashboard after signup
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">Setup Your Business</h2>
        <p className="text-center text-gray-500 mb-6">Step {step} of 3</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-pink-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          
          {/* STEP 1: ACCOUNT SETUP */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="fullName" type="text" className="w-full mt-1 p-2 border rounded" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input type="file" accept="image/*" className="w-full mt-1 p-2 border rounded bg-white" onChange={handlePhotoChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" className="w-full mt-1 p-2 border rounded" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" className="w-full mt-1 p-2 border rounded" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              </div>
            </>
          )}

          {/* STEP 2: BUSINESS DETAILS */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input name="businessName" type="text" className="w-full mt-1 p-2 border rounded" placeholder="Grand Banquet Hall" value={formData.businessName} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <select name="clientType" className="w-full mt-1 p-2 border rounded" value={formData.clientType} onChange={handleChange}>
                  <option>Standalone Banquet Hall</option>
                  <option>Hotel Banquet Department</option>
                  <option>Convention Center</option>
                  <option>Event Management Company</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GST Number</label>
                <input name="gstNumber" type="text" className="w-full mt-1 p-2 border rounded" placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input name="city" type="text" className="w-full mt-1 p-2 border rounded" placeholder="Mumbai" value={formData.city} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input name="address" type="text" className="w-full mt-1 p-2 border rounded" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          {/* STEP 3: VENUE SETUP */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Venue Type</label>
                <select name="venueType" className="w-full mt-1 p-2 border rounded" value={formData.venueType} onChange={handleChange}>
                  <option>Banquet Hall</option>
                  <option>Lawn / Garden</option>
                  <option>Conference Room</option>
                  <option>Rooftop</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Capacity</label>
                  <input name="capacityMin" type="number" className="w-full mt-1 p-2 border rounded" placeholder="50" value={formData.capacityMin} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                  <input name="capacityMax" type="number" className="w-full mt-1 p-2 border rounded" placeholder="500" value={formData.capacityMax} onChange={handleChange} />
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded text-sm text-gray-600">
                <p><strong>Note:</strong> You can add more halls, rooms, and detailed pricing packages from the dashboard later.</p>
              </div>
            </>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-semibold">
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold">
                Next Step
              </button>
            ) : (
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">
                Complete Setup
              </button>
            )}
          </div>

        </form>
        
        {step === 1 && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </p>
        )}
      </div>
    </div>
  );
}