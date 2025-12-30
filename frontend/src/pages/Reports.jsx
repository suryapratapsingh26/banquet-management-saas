import React from 'react';

export default function Reports() {
  // Mock Data for Executive Dashboard
  const kpis = [
    { label: 'Total Revenue (MTD)', value: '₹12,50,000', change: '+15%', color: 'text-green-600' },
    { label: 'Total Events', value: '12', change: '+2', color: 'text-blue-600' },
    { label: 'Avg Audit Score', value: '92%', change: '-1%', color: 'text-yellow-600' },
    { label: 'SLA Breaches', value: '5', change: '-2', color: 'text-red-600' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12.5, expense: 8.2 },
    { month: 'Feb', revenue: 15.0, expense: 9.5 },
    { month: 'Mar', revenue: 11.2, expense: 7.8 },
    { month: 'Apr', revenue: 18.5, expense: 10.0 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-pink-600">
            <div className="text-sm text-gray-500 font-medium uppercase">{kpi.label}</div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div className={`text-sm font-semibold ${kpi.color}`}>{kpi.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Simulation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue vs Expenses (₹ Lakhs)</h3>
          <div className="flex items-end space-x-6 h-64 border-b border-gray-200 pb-2">
            {revenueData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col justify-end space-y-1 group">
                <div className="relative flex space-x-1 h-full items-end justify-center">
                  {/* Revenue Bar */}
                  <div 
                    style={{ height: `${data.revenue * 4}%` }} 
                    className="w-4 bg-pink-500 rounded-t transition-all duration-500 group-hover:bg-pink-600"
                  ></div>
                  {/* Expense Bar */}
                  <div 
                    style={{ height: `${data.expense * 4}%` }} 
                    className="w-4 bg-gray-300 rounded-t transition-all duration-500 group-hover:bg-gray-400"
                  ></div>
                </div>
                <div className="text-xs text-center text-gray-500 font-medium">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center"><span className="w-3 h-3 bg-pink-500 rounded-full mr-1"></span> Revenue</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-gray-300 rounded-full mr-1"></span> Expenses</div>
          </div>
        </div>

        {/* Operational Health Scorecard */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Operational Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Event Readiness Index</span>
                <span className="font-bold text-green-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Task SLA Compliance</span>
                <span className="font-bold text-yellow-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customer Satisfaction (NPS)</span>
                <span className="font-bold text-blue-600">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}