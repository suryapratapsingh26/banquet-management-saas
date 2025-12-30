import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-sm">
        <div className="text-2xl font-bold text-blue-900">Asyncotel</div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Manage Your Banquet Hall <br /> <span className="text-blue-600">Like a Pro</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          The complete SaaS solution for bookings, operations, F&B, and billing.
          Streamline your events and grow your revenue.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 shadow-lg">
            Start Free Trial
          </Link>
          <Link to="/login" className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50">
            Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        © 2024 Asyncotel. All rights reserved.
      </footer>
    </div>
  );
}