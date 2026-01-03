import { Link } from "react-router-dom";

export default function SignupSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Choose Your Business Type</h1>
        <p className="text-center text-gray-500 mb-10">Select how you want to use Asyncotel. Only business owners should sign up here.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Banquet Hall */}
          <Link to="/signup/banquet-hall" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-center">
            <div className="text-5xl mb-4">🏰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">Banquet Hall / Hotel</h3>
            <p className="text-gray-500 text-sm">
              I own a venue (Hotel, Banquet, Lawn) and want to manage bookings, inventory, and operations.
            </p>
          </Link>

          {/* Option 2: Event Management Company */}
          <Link to="/signup/event-company" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-pink-500 hover:shadow-md transition-all text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">Event Management Company</h3>
            <p className="text-gray-500 text-sm">
              I plan events at multiple venues and need to manage clients, vendors, and coordination.
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Are you a Staff Member or Vendor? <br/>
            <span className="text-gray-400">Vendor and Staff accounts are created by the Banquet Hall Owner. Please ask them for an invite.</span>
          </p>
          <div className="mt-6">
            <Link to="/login" className="text-pink-600 font-medium hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}