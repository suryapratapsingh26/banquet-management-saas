import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetupOrganization() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientType: "",
    businessName: "", gstNumber: "", panNumber: "", city: "", address: "",
    venueType: "Banquet Hall", capacityMin: "", capacityMax: "",
    selectedPlan: "Pro"
  });

  const isVenueBased = formData.clientType !== "Event Management Company";
  const totalSteps = isVenueBased ? 4 : 3;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, clientType: type });
    setStep(2);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleComplete = (e) => {
    e.preventDefault();
    // Save business details logic here
    alert("Setup Complete! Welcome to your Dashboard.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 ? "Welcome! Let's set up your business" : "Tell us about your business"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Step {step} of {totalSteps}</p>
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-100 rounded-full h-1.5 mt-4">
            <div className="bg-pink-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        {/* STEP 1: CHOOSE TYPE */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div onClick={() => handleTypeSelect("Standalone Banquet Hall")} className="cursor-pointer group bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-center">
              <div className="text-5xl mb-4">🏰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">Banquet Hall / Hotel</h3>
              <p className="text-gray-500 text-sm">I own a venue and want to manage bookings & operations.</p>
            </div>

            <div onClick={() => handleTypeSelect("Event Management Company")} className="cursor-pointer group bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">Event Company</h3>
              <p className="text-gray-500 text-sm">I plan events at multiple venues and manage clients.</p>
            </div>
          </div>
        )}

        {/* FORM STEPS */}
        {step > 1 && (
          <form onSubmit={handleComplete} className="max-w-lg mx-auto space-y-6">
            
            {/* STEP 2: BUSINESS DETAILS */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input name="businessName" type="text" className="w-full mt-1 p-2 border rounded" placeholder="Grand Banquet Hall" value={formData.businessName} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GST Number</label>
                    <input name="gstNumber" type="text" className="w-full mt-1 p-2 border rounded" placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                    <input name="panNumber" type="text" className="w-full mt-1 p-2 border rounded" placeholder="ABCDE1234F" value={formData.panNumber} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input name="city" type="text" className="w-full mt-1 p-2 border rounded" placeholder="Mumbai" value={formData.city} onChange={handleChange} />
                </div>
              </>
            )}

            {/* STEP 3: VENUE SETUP */}
            {step === 3 && isVenueBased && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Venue Type</label>
                  <select name="venueType" className="w-full mt-1 p-2 border rounded" value={formData.venueType} onChange={handleChange}>
                    <option>Banquet Hall</option>
                    <option>Lawn / Garden</option>
                    <option>Conference Room</option>
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
              </>
            )}

            {/* STEP 4: PLAN SELECTION */}
            {step === totalSteps && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Select Your Plan</h3>
                <div className="grid grid-cols-1 gap-4">
                  {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                    <div 
                      key={plan}
                      onClick={() => setFormData({...formData, selectedPlan: plan})}
                      className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${formData.selectedPlan === plan ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
                    >
                      <div>
                        <span className="font-bold text-gray-800">{plan} Plan</span>
                        <p className="text-xs text-gray-500">Feature set description for {plan}</p>
                      </div>
                      <div className="text-pink-600 font-bold">Select</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NAVIGATION */}
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={prevStep} className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-semibold cursor-pointer">
                Back
              </button>
              
              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer">
                  Next Step
                </button>
              ) : (
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold cursor-pointer">
                  Go Live
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}