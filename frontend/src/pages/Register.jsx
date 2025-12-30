import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const categories = [
    { id: 'OWNER', label: 'Banquet Hall Owner', icon: '🏢', desc: 'Register your property & get Admin access' },
    { id: 'MANAGER', label: 'Banquet Manager / Admin', icon: '👨‍💼', desc: 'Join an existing banquet team' },
    { id: 'STAFF', label: 'Operations Staff', icon: '🧑‍🍳', desc: 'Kitchen, Housekeeping, Security, etc.' },
    { id: 'VENDOR', label: 'Vendor / Supplier', icon: '🤝', desc: 'Decor, Catering, Photography, etc.' },
    { id: 'EVENT_CO', label: 'Event Mgmt Company', icon: '🏗️', desc: 'Bulk booking & event handling' },
    { id: 'SUPER_ADMIN', label: 'Asyncotel Super Admin', icon: '🧑‍💻', desc: 'Internal: Platform Control' },
    { id: 'INTERNAL', label: 'Asyncotel Team', icon: '💼', desc: 'Sales, Support, Accounts' },
    { id: 'CLIENT', label: 'Client / Customer', icon: '👤', desc: 'Plan & book your event' },
  ];

  const handleSelection = (id) => {
    const routes = {
      OWNER: '/signup/owner',
      MANAGER: '/signup/manager',
      STAFF: '/signup/staff',
      VENDOR: '/signup/vendor',
      EVENT_CO: '/signup/event-company',
      SUPER_ADMIN: '/signup/super-admin',
      INTERNAL: '/signup/internal',
      CLIENT: '/signup/client',
    };

    if (routes[id]) {
      navigate(routes[id]);
    } else {
      alert(`Signup flow for ${id} is coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Asyncotel</h1>
          <p className="text-gray-600 mt-2">Select your profile to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelection(cat.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-pink-500 transition-all text-left group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-600">{cat.label}</h3>
              <p className="text-sm text-gray-500 mt-2">{cat.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}