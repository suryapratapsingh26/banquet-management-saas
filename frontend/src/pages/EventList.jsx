import React from 'react';

const MOCK_EVENTS = [
  { id: 'EVT101', name: 'Sharma-Verma Wedding', type: 'WEDDING', date: '2025-01-10', pax: 500, hall: 'Grand Ballroom', status: 'UPCOMING' },
  { id: 'EVT102', name: 'TechConf 2025', type: 'CORPORATE', date: '2025-01-12', pax: 150, hall: 'Conference Hall A', status: 'CONFIRMED' },
  { id: 'EVT103', name: 'Rahul Birthday Bash', type: 'SOCIAL', date: '2025-01-05', pax: 80, hall: 'Poolside', status: 'COMPLETED' },
  { id: 'EVT104', name: 'Annual General Meeting', type: 'CONFERENCE', date: '2025-01-20', pax: 300, hall: 'Grand Ballroom', status: 'DRAFT' },
];

export default function EventList() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Event Management</h2>
        <button className="bg-pink-600 text-white px-4 py-2 rounded text-sm hover:bg-pink-700 shadow-sm transition-colors">
          + New Event
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_EVENTS.map((evt) => (
              <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{evt.name}</div>
                  <div className="text-xs text-gray-500">{evt.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${evt.type === 'WEDDING' ? 'bg-pink-100 text-pink-800' : 
                      evt.type === 'CORPORATE' ? 'bg-blue-100 text-blue-800' : 
                      evt.type === 'SOCIAL' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {evt.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.hall}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.pax}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${evt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 
                      evt.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {evt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-pink-600 hover:text-pink-900 mr-3 font-semibold">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}