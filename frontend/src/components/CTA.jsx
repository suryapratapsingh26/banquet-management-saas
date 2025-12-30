export default function CTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-16">
          THIS IS WHAT THE BEST BANQUET MANAGEMENT SOFTWARE OFFERS YOU!
        </h2>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            "More customers & visibility",
            "Banquet CRM & reminders",
            "Mobile-friendly access",
            "GST invoicing & reports",
            "Manage multiple halls",
            "Anywhere, anytime access",
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow">
              <h4 className="font-semibold mb-3">{item}</h4>
              <p className="text-gray-600 text-sm">
                Simplify banquet operations and scale with confidence.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}