import React, { useState } from 'react';

/**
 * UNIVERSAL ONBOARDING CHECKLIST
 * Requirement #11: KYC, Role Assignment, Module Activation, Training, Go-Live
 */
export default function OnboardingChecklist({ entityName, entityType, onComplete }) {
  // Initial state based on requirements
  const [checklist, setChecklist] = useState([
    { id: 'KYC', label: 'KYC Verification (Aadhaar/GST/PAN)', status: 'PENDING', required: true },
    { id: 'ROLE', label: 'Role & Permission Assignment', status: 'PENDING', required: true },
    { id: 'MODULES', label: 'Module Activation & Configuration', status: 'PENDING', required: true },
    { id: 'TRAINING', label: 'Training / Walkthrough Completed', status: 'PENDING', required: false },
    { id: 'APPROVAL', label: 'Final Go-Live Approval', status: 'LOCKED', required: true },
  ]);

  const toggleStatus = (id) => {
    setChecklist(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          if (item.status === 'LOCKED') return item;
          return { ...item, status: item.status === 'DONE' ? 'PENDING' : 'DONE' };
        }
        return item;
      });

      // Check if Approval can be unlocked
      const allRequiredDone = updated
        .filter(i => i.id !== 'APPROVAL' && i.required)
        .every(i => i.status === 'DONE');

      return updated.map(item => {
        if (item.id === 'APPROVAL') {
          return { ...item, status: allRequiredDone ? (item.status === 'DONE' ? 'DONE' : 'PENDING') : 'LOCKED' };
        }
        return item;
      });
    });
  };

  const isReady = checklist.find(i => i.id === 'APPROVAL')?.status === 'DONE';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-md">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Onboarding Status</h3>
          <p className="text-gray-400 text-xs">{entityName} ({entityType})</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${isReady ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
          {isReady ? 'LIVE' : 'IN PROGRESS'}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {checklist.map((item) => (
          <div 
            key={item.id} 
            onClick={() => item.status !== 'LOCKED' && toggleStatus(item.id)}
            className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer ${
              item.status === 'DONE' ? 'bg-green-50 border-green-200' : 
              item.status === 'LOCKED' ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed' : 
              'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                item.status === 'DONE' ? 'bg-green-500 border-green-500 text-white' : 
                item.status === 'LOCKED' ? 'bg-gray-300 border-gray-300' : 
                'border-gray-400'
              }`}>
                {item.status === 'DONE' && '✓'}
                {item.status === 'LOCKED' && '🔒'}
              </div>
              <span className={`text-sm font-medium ${item.status === 'DONE' ? 'text-green-800' : 'text-gray-700'}`}>
                {item.label} {item.required && <span className="text-red-500">*</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isReady && (
        <div className="p-4 bg-green-50 border-t border-green-100 text-center">
          <button onClick={onComplete} className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 font-bold text-sm w-full">Confirm & Activate Account</button>
        </div>
      )}
    </div>
  );
}