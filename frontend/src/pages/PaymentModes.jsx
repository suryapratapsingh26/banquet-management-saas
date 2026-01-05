import { useState, useEffect } from "react";

export default function PaymentModes() {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("paymentModes")) || [
        { id: 1, name: "Cash", enabled: true },
        { id: 2, name: "Bank Transfer (NEFT/RTGS)", enabled: true },
        { id: 3, name: "UPI", enabled: true },
        { id: 4, name: "Credit/Debit Card", enabled: false },
        { id: 5, name: "Cheque", enabled: true },
    ];
    setModes(saved);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Modes</h1>
        <p className="text-gray-500 text-sm">Configure accepted payment methods.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Mode Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modes.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${m.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {m.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">Toggle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}