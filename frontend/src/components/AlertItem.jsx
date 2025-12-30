import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AlertItem = ({ alert }) => {
  const icons = {
    warning: <AlertTriangle className="h-4 w-4 text-orange-500" />,
    error: <AlertTriangle className="h-4 w-4 text-red-500" />,
    info: <Clock className="h-4 w-4 text-blue-500" />,
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
  };
  
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer border border-transparent hover:border-gray-100">
      <div className="mt-0.5 shrink-0">{icons[alert.type]}</div>
      <div className="text-sm text-gray-700 leading-snug">{alert.text}</div>
    </div>
  );
};

export default AlertItem;