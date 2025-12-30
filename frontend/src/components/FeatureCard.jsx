import React from "react";

export default function FeatureCard({ title, children, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex gap-4 items-start">
      <div className="shrink-0 w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{children}</p>
      </div>
    </div>
  );
}
