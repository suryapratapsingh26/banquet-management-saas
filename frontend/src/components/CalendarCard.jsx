import React from 'react';

export default function CalendarCard() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Bookings Calendar</h4>
        <div className="text-sm text-gray-500">April 2024</div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-600">
        {days.map(d => <div key={d} className="font-medium text-gray-500">{d}</div>)}
        {Array.from({length: 35}).map((_,i) => (
          <div key={i} className={`p-2 rounded-md ${i===15? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-gray-50'}`}>{i%30+1}</div>
        ))}
      </div>
    </div>
  );
}
