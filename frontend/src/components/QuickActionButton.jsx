import React from 'react';

const QuickActionButton = ({ icon: Icon, label, color }) => (
  <button className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group">
    <div className={`p-4 rounded-full mb-3 ${color} group-hover:scale-110 transition-transform duration-200`}>
      <Icon className="h-6 w-6" />
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
  </button>
);

export default QuickActionButton;