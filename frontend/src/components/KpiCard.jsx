import React from 'react';

const KpiCard = ({ title, value, icon: Icon, color, action }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
        <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-50">
        <button className={`text-sm font-medium ${colorClasses[color].replace('bg-', 'text-').replace('50', '600')} hover:opacity-80 flex items-center transition-opacity`}>
          {action} <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default KpiCard;