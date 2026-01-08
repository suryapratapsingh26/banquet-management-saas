import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config";

export default function StaffLogin() {
  const navigate = useNavigate();
  const { login, setAuth } = useAuth(); 
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("SEND_OTP"); // SEND_OTP, VERIFY_OTP
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, type: 'USER' })
      });
      if (res.ok) {
        setStep("VERIFY_OTP");
      } else {
        alert("User not found or invalid mobile number.");
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, type: 'USER' })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Use AuthContext to set in-memory auth (refresh cookie is set by server)
        setAuth(data.token, data.user || { name: data.name, role: 'VENDOR' });
        window.location.href = "/dashboard";
      } else {
        alert("Invalid OTP");
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Staff Login</h1>
          <p className="text-gray-500 text-sm">Operations & Kitchen Team Access</p>
        </div>

        {step === "SEND_OTP" ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input 
                type="tel" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                placeholder="9876543210"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-center tracking-widest text-xl"
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
            <button 
              type="button"
              onClick={() => setStep("SEND_OTP")}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
      <div className="mt-8 text-center">
        <a href="/login" className="text-sm text-pink-600 font-medium hover:underline">Admin/Sales Login (Email) →</a>
      </div>
    </div>
  );
}