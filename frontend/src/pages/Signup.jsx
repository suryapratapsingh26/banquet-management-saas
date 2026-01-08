import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config";

export default function Signup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    gst: "",
    pan: "",
    plan: "STARTER"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    // Step 1 Validation
    if (currentStep === 1) {
      if (!formData.businessName || !formData.businessType || !formData.plan) {
        setError("Please fill in all business details.");
        return;
      }
    }

    // Step 2 Validation
    if (currentStep === 2) {
      if (!formData.fullName || !formData.mobile || !formData.email || !formData.password) {
        setError("Please fill in all admin details.");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Get started with Asyncotel</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center w-1/3 relative">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 ${
                step <= currentStep ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step}
              </div>
              <div className="text-xs mt-1 text-gray-500 font-medium">
                {step === 1 ? "Business" : step === 2 ? "Admin" : "Property"}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center text-sm">
            {error}
            {error.includes("already exists") && (
              <>
                {' '}
                <Link to="/login" className="font-bold underline hover:text-pink-700">Please try logging in.</Link>
              </>
            )}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Step 1: Business & Plan Selection */}
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input name="businessName" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="Grand Banquet Hall" value={formData.businessName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <select name="businessType" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" value={formData.businessType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Banquet Hall">Banquet Hall</option>
                  <option value="Catering">Catering</option>
                  <option value="Event Planner">Event Planner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                <select name="plan" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" value={formData.plan} onChange={handleChange} required>
                  <option value="STARTER">Starter (Small Business)</option>
                  <option value="GROWTH">Growth (Multi-Hall / High Volume)</option>
                  <option value="ENTERPRISE">Enterprise (Custom)</option>
                </select>
              </div>
              <button onClick={handleNext} className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer mt-4 transition-colors">
                Continue
              </button>
            </>
          )}

          {/* Step 2: Admin Details */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input name="fullName" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input name="mobile" type="tel" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="+91 98765 43210" value={formData.mobile} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleBack} className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-semibold cursor-pointer transition-colors">
                  Back
                </button>
                <button onClick={handleNext} className="w-2/3 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer transition-colors">
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Property & Compliance Details */}
          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input name="city" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="City" value={formData.city} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input name="state" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="State" value={formData.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Full Address</label>
                <input name="address" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="Full Address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input name="gst" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="GST Number" value={formData.gst} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PAN Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input name="pan" type="text" className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" placeholder="PAN Number" value={formData.pan} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleBack} className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-semibold cursor-pointer transition-colors">
                  Back
                </button>
                <button type="submit" className="w-2/3 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer transition-colors">
                  Create Account
                </button>
              </div>
            </>
          )}
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}