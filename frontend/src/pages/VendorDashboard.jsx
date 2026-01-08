import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useAuth } from "../components/AuthContext";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [myRating, setMyRating] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchMyRating = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vendors`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const vendors = await res.json();
        const me = vendors.find((v) => v.id === 101);
        if (me) setMyRating(me.rating);
      } catch (e) {
        console.error('Failed to fetch vendors', e);
      }
    };
    fetchMyRating();
  }, [token]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Portal</h1>
        <p className="text-gray-500 text-sm">Manage your assigned events and tasks.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome Partner!</h3>
        
        <div className="mb-6">
          <p className="text-gray-500 text-sm">Your Performance Score</p>
          <p className="text-4xl font-bold text-green-600 mt-1">{myRating || "N/A"} <span className="text-base text-gray-400">/ 5.0</span></p>
        </div>

        <p className="text-gray-500 mb-6">You have 2 upcoming event assignments.</p>
        <button onClick={() => navigate("/tasks")} className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
          View My Tasks
        </button>
      </div>
    </>
  );
}