export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left text */}
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">
            Intuitive Dashboard
          </p>

          <h2 className="text-4xl font-bold mb-4">
            <span className="text-pink-500">Smart insights,</span> <br />
            better hall management
          </h2>

          <p className="text-gray-600 mb-8">
            Visualize bookings, track revenue, and analyze customer preferences —
            empowering you to make smarter decisions.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-gray-700">
              ✅ Flexible solution
            </span>
            <span className="flex items-center gap-2 text-gray-700">
              ✅ Setup in seconds
            </span>
          </div>
        </div>

        {/* Right cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 rounded-xl shadow bg-gray-50">
            <h4 className="font-semibold mb-4">Revenue Tracking</h4>
            <div className="h-24 bg-purple-400/30 rounded" />
          </div>

          <div className="p-6 rounded-xl shadow bg-gray-50">
            <h4 className="font-semibold mb-4">Analytics</h4>
            <div className="h-24 bg-indigo-400/30 rounded" />
          </div>

          <div className="col-span-2 p-6 rounded-xl shadow bg-gray-50">
            <h4 className="font-semibold mb-4">Automation Tasks</h4>
            <div className="h-40 bg-pink-500/30 rounded-full mx-auto w-40" />
          </div>
        </div>

      </div>
    </section>
  );
}