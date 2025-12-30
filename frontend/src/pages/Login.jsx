import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Mocking a successful login. In a real app, you'd call an API.
    // For this demo, any email/password will work.
    const userData = {
      name: "Admin User",
      role: "admin", // 'admin' can see everything
    };
    login(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
              placeholder="admin@asyncotel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded focus:ring-pink-500 focus:border-pink-500" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-pink-600 hover:underline">Sign up</Link>
        </p>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/super-admin" className="text-xs text-gray-500 hover:text-pink-600 font-medium">Asyncotel Super Admin Login</Link>
        </div>
      </div>
    </div>
  );
}