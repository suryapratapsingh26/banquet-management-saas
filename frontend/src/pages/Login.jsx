import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-pink-600">Asyncotel Login</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sign in to your account</p>
        {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="w-full mt-1 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="w-full mt-1 p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 font-semibold cursor-pointer">Login</button>
        </form>
        <div className="mt-4 text-center text-sm"><Link to="/signup" className="text-pink-600 hover:underline">Register New Property</Link></div>
      </div>
    </div>
  );
}