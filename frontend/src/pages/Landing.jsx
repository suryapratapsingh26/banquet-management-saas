import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Asyncotel <span className="text-pink-600">SaaS</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The complete operating system for Banquet Halls, Event Venues, and Catering Companies.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow hover:shadow-md transition">
            Login
          </Link>
          <Link to="/signup" className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow hover:bg-pink-700 transition">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}