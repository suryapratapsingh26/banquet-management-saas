import React from 'react';

export default function Overview() {
  const userRole = localStorage.getItem('role') || 'Manager';
  
  const stats = [
    { label: 'Events Today', value: '2', color: 'bg-blue-500' },
    { label: 'Pending Tasks', value: '14', color: 'bg-yellow-500' },
    { label: 'Issues Reported', value: '3', color: 'bg-red-500' },
    { label: 'New Enquiries', value: '8', color: 'bg-green-500' },
  ];

  const activities = [
    { time: '10:30 AM', text: 'Chef Anand updated the menu for Sharma Wedding', type: 'update' },
    { time: '09:15 AM', text: 'Audit failed for "Main Hall AC"', type: 'alert' },
    { time: 'Yesterday', text: 'New booking confirmed: TechConf 2025', type: 'success' },
    { time: 'Yesterday', text: 'Decor vendor uploaded stage photos', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-pink-600 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userRole}</h2>
          <p className="text-gray-500">Here is what's happening in your banquet hall today.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Current Time</div>
          <div className="text-xl font-mono font-semibold text-gray-700">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="font-semibold text-gray-800">View Details &rarr;</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 font-bold text-gray-700">Recent Activity</div>
          <div className="p-4 space-y-4">
            {activities.map((act, idx) => (
              <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="text-xs text-gray-400 w-16 pt-1">{act.time}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{act.text}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-2 
                  ${act.type === 'alert' ? 'bg-red-500' : 
                    act.type === 'success' ? 'bg-green-500' : 
                    act.type === 'update' ? 'bg-blue-500' : 'bg-gray-400'}`} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 font-bold text-gray-700">Quick Actions</div>
          <div className="p-4 space-y-2">
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 border border-gray-200">+ Create New Event</button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 border border-gray-200">+ Add Staff Member</button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 border border-gray-200">! Report Maintenance Issue</button>
            <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 border border-gray-200">$ Generate Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
}