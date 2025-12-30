import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter valid credentials");
      return;
    }

    // Mock Super Admin Login
    const userData = {
      name: "Super Admin",
      role: "super_admin",
    };
    login(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Asyncotel Platform</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Super Admin Access</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border rounded focus:ring-slate-500 focus:border-slate-500" 
              placeholder="root@asyncotel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded focus:ring-slate-500 focus:border-slate-500" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-900 font-semibold">
            Access Console
          </button>
        </form>
        <div className="mt-4 text-center">
             <button onClick={() => navigate("/login")} className="text-sm text-slate-600 hover:underline">Back to Property Login</button>
        </div>
      </div>
    </div>
  );
}