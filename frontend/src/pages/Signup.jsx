import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    // 1. Create User (Mock)
    const newUser = {
      name: formData.fullName,
      email: formData.email,
      role: "admin", // Default to admin of their own tenant
      isSetupComplete: false // Flag to trigger setup flow
    };

    // 1.1 Save to LocalStorage for Login
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

    // 2. Auto Login
    login(newUser);

    // 3. Redirect to Business Setup
    navigate("/setup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-6">Get started with Asyncotel</p>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="fullName" type="text" className="w-full mt-1 p-2 border rounded" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" className="w-full mt-1 p-2 border rounded" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" className="w-full mt-1 p-2 border rounded" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer">
            Create Account
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}