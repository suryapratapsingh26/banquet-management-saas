import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  
  // Mock status - in real app, fetch from API
  const steps = [
    { id: 1, label: 'Account Created', status: 'DONE', date: '2023-10-25' },
    { id: 2, label: 'KYC Verification', status: 'DONE', date: '2023-10-26' },
    { id: 3, label: 'Role Assignment', status: 'PENDING', desc: 'Waiting for Admin to assign role.' },
    { id: 4, label: 'Training Completion', status: 'LOCKED', desc: 'Watch training videos after role assignment.' },
    { id: 5, label: 'Go-Live Approval', status: 'LOCKED', desc: 'Final activation by Owner.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-yellow-500 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Onboarding in Progress</h2>
          <p className="opacity-90">Please complete the steps below to access the dashboard.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'DONE' ? 'bg-green-500 text-white' :
                    step.status === 'PENDING' ? 'bg-yellow-500 text-white animate-pulse' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step.status === 'DONE' ? '✓' : index + 1}
                  </div>
                </div>
                <div>
                  <h4 className={`font-semibold ${step.status === 'LOCKED' ? 'text-gray-400' : 'text-gray-800'}`}>{step.label}</h4>
                  {step.desc && <p className="text-sm text-gray-500">{step.desc}</p>}
                  {step.date && <p className="text-xs text-green-600 mt-1">Completed on {step.date}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <button onClick={() => navigate('/login')} className="text-gray-500 hover:text-gray-700 text-sm">Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}