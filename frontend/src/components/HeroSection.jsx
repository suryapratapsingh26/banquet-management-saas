export default function HeroSection() {
  return (
    <section id="features" className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm text-gray-500 mb-3">Intuitive Dashboard</p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            <span className="text-green-400">Smart insights,</span>
            <br />
            better hall
            <br />
            management
          </h1>

          <p className="text-gray-500 text-lg max-w-lg mb-8">
            Visualize bookings, track revenue, and analyze customer preferences —
            empowering you to make smarter decisions.
          </p>

          <button className="bg-green-400 hover:bg-green-500 text-black px-8 py-4 rounded-full font-semibold">
            Learn more →
          </button>

          <div className="flex gap-6 mt-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              ✅ Flexible solution
            </span>
            <span className="flex items-center gap-2">
              ✅ Setup in seconds
            </span>
          </div>
        </div>

        {/* RIGHT ANALYTICS CARDS */}
        <div className="grid grid-cols-2 gap-6">

          {/* Revenue Tracking */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="font-semibold mb-3">Revenue Tracking</p>
            <div className="h-28 bg-purple-100 rounded-lg flex items-end gap-2 p-3">
              {[40, 60, 50, 70, 45, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-3 bg-purple-500 rounded"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="font-semibold mb-3">Analytics</p>
            <div className="h-28 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  points="0,40 20,20 40,25 60,10 80,15 100,0"
                />
              </svg>
            </div>
          </div>

          {/* Automation Tasks (FULL WIDTH) */}
          <div className="col-span-2 bg-white rounded-2xl shadow-md p-6 flex gap-8 items-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-[14px] border-purple-400 border-r-green-400 border-b-gray-200" />
            </div>

            <div>
              <p className="font-semibold mb-2">Automation Tasks</p>
              <p className="text-sm text-purple-500">Invoice Automation – 60%</p>
              <p className="text-sm text-green-500">Analytics Automation – 25%</p>
              <p className="text-sm text-gray-500">Others – 15%</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}