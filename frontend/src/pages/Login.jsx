import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Fetch Users from LocalStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // 2. Find User (Mock Auth)
    const user = users.find(u => u.email === email);

    if (!user) {
        alert("Invalid credentials. Please check email or ask Admin to create your account.");
        return;
    }

    // 3. Login
    login(user);

    // 4. Role-Based Redirect Logic
    switch(user.role) {
        case 'Super Admin':
            navigate("/super-admin-dashboard");
            break;
            
        case 'Owner':
        case 'admin':
        case 'Property Admin':
            navigate("/reports"); // Main Admin Dashboard
            break;
            
        case 'Sales Manager':
        case 'Sales Executive':
        case 'CRM Executive':
            navigate("/sales"); // Dedicated Sales Dashboard
            break;
            
        case 'Event Operations Manager':
        case 'Banquet Coordinator':
        case 'Banquet Manager':
            navigate("/operations"); // Dedicated Ops Dashboard
            break;
            
        case 'F&B Manager':
        case 'Kitchen Head':
            navigate("/fnb-dashboard"); // Dedicated F&B Dashboard
            break;
            
        case 'Accounts Manager':
            navigate("/accounts"); // Dedicated Finance Dashboard
            break;

        case 'Inventory Manager':
            navigate("/inventory");
            break;
            
        case 'HR Manager':
            navigate("/users");
            break;

        default:
            navigate("/reports"); // Fallback
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">Asyncotel Login</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sign in to your account</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="w-full mt-1 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="w-full mt-1 p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer">
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm"><Link to="/signup" className="text-pink-600 hover:underline">Register New Property</Link></div>
      </div>
    </div>
  );
}