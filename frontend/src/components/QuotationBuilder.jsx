export default function QuotationBuilder() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">
        Quotation Builder
      </h2>

      <ul className="space-y-2 text-sm">
        <li>Venue – ₹50,000</li>
        <li>Catering (250 Pax) – ₹1,20,000</li>
        <li>Decoration – ₹40,000</li>
        <li>DJ Services – ₹15,000</li>
        <li>GST (18%) – ₹37,800</li>
      </ul>

      <div className="font-semibold mt-3">
        Total Amount: ₹2,62,800
      </div>

      <div className="flex gap-3 mt-4">
        <button className="btn-primary">Generate Quote</button>
        <button className="btn-success">Send via Email</button>
        <button className="btn-success">Download PDF</button>
      </div>
    </div>
  );
}