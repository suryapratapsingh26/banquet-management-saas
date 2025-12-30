import React from 'react';

export default function StaffOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h4 className="font-semibold mb-3">Staff Overview</h4>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-200 to-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">22</div>
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600"><div>Available</div><div>22</div></div>
          <div className="flex justify-between text-sm text-gray-600"><div>On Duty</div><div>15</div></div>
          <div className="flex justify-between text-sm text-gray-600"><div>On Leave</div><div>3</div></div>
        </div>
      </div>
    </div>
  );
}
