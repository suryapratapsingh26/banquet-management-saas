import { useState, useEffect } from "react";
import { API_URL } from "../config";

export default function VendorPortal() {
  // Simulating a logged-in vendor for MVP. In real app, this comes from auth.
  const [vendorId, setVendorId] = useState(null); 
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("LOGIN"); // LOGIN, VERIFY, DASHBOARD
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, type: 'VENDOR' })
      });
      if (res.ok) setStep("VERIFY");
      else alert("Vendor not found");
    } catch (error) { console.error(error); }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, type: 'VENDOR' })
      });
      const data = await res.json();
      if (res.ok) {
        setVendorId(data.vendorId);
        setStep("DASHBOARD");
      } else alert("Invalid OTP");
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (step === "DASHBOARD" && vendorId) {
      fetchTasks();
    }
  }, [step, vendorId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/vendor-portal/tasks?vendorId=${vendorId}`);
      if (res.ok) setTasks(await res.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Vendor Portal</h1>
          
          {step === "LOGIN" && (
            <div className="flex gap-4">
              <input type="text" placeholder="Mobile Number" className="border p-2 rounded flex-1" value={mobile} onChange={e => setMobile(e.target.value)} />
              <button onClick={sendOtp} className="bg-pink-600 text-white px-6 py-2 rounded font-bold">Send OTP</button>
            </div>
          )}

          {step === "VERIFY" && (
            <div className="flex gap-4">
              <input type="text" placeholder="Enter OTP" className="border p-2 rounded flex-1" value={otp} onChange={e => setOtp(e.target.value)} />
              <button onClick={verifyOtp} className="bg-green-600 text-white px-6 py-2 rounded font-bold">Verify & Login</button>
            </div>
          )}

          {step === "DASHBOARD" && (
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">Logged in as Vendor</span>
              <button onClick={() => setStep("LOGIN")} className="text-sm text-gray-500 underline">Logout</button>
            </div>
          )}
        </div>

        {step === "DASHBOARD" && (
          loading ? <div className="text-center">Loading...</div> : (
          <div className="grid grid-cols-1 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{task.event?.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(task.event?.startDate).toDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-4 text-gray-700">{task.description}</p>
              </div>
            ))}
            {tasks.length === 0 && vendorId && <div className="text-center text-gray-500">No tasks assigned.</div>}
          </div>
          )
        )}
      </div>
    </div>
  );
}