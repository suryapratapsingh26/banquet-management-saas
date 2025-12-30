import React from 'react';

const StatRow = ({ label, value, icon: Icon, color, bg }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-default">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-md ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

export default StatRow;