import React from 'react';

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-lg">Revenue Overview</h4>
        <p className="text-sm text-gray-500">Monthly Revenue • Enquiries</p>
      </div>
      <div className="h-48 flex items-end gap-3">
        {[30,50,40,60,70,55,80].map((v, i) => (
          <div key={i} className="flex-1">
            <div style={{ height: `${v}%` }} className="bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all"></div>
            <div className="text-xs text-center text-gray-400 mt-2">M{i+1}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>Total Revenue: ₹18,20,000</div>
        <div>Pending Payments: ₹1,25,000</div>
      </div>
    </div>
  );
}
