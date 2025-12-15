import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const HouseholdSummary: React.FC = () => {
  const gaugeData = [
    { name: 'Low', value: 1, color: '#a78bfa' },   // Lighter Purple
    { name: 'Mid', value: 1, color: '#2dd4bf' },   // Teal
    { name: 'High', value: 1, color: '#22c55e' },  // Green
  ];

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8 border-t border-slate-200 pt-8">
      {/* Left Panel: Household Profile */}
      <div className="flex-1 bg-slate-50 p-6 rounded-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">
          Household profile
        </h3>

        <div className="space-y-6">
          {/* Person 1 */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Luning Deng</h4>
              <div className="text-slate-600 text-sm mt-1">Age 33 | Currently working</div>
              <div className="text-slate-400 text-xs mt-1 lowercase">yearly income</div>
            </div>
            <div className="text-slate-900 font-medium text-lg tracking-tight">$158,000</div>
          </div>

          {/* Person 2 */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Morris Lam</h4>
              <div className="text-slate-600 text-sm mt-1">Age 31 | Currently working</div>
              <div className="text-slate-400 text-xs mt-1 lowercase">yearly income</div>
            </div>
            <div className="text-slate-900 font-medium text-lg tracking-tight">$72,000</div>
          </div>
        </div>
      </div>

      {/* Right Panel: Probability Gauge */}
      <div className="flex-1 bg-slate-50 p-6 rounded-sm border border-slate-100">
        <h3 className="text-xl font-normal text-slate-800 mb-6">How are you doing?</h3>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative w-32 h-16 shrink-0 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={64}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={2}
                        >
                            {gaugeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-xl font-bold text-slate-800 leading-none">99%</span>
                </div>
            </div>
            
            <div className="text-sm text-slate-600 space-y-3">
                <p>
                    Your plan's probability of success of <strong className="text-green-700">99%</strong> is likely well set for your planned retirement.
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                    Consider that even in a below average plan could create $25,442 more than monthly income we estimate you may need in retirement.
                </p>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
            <a href="#" className="text-blue-700 text-sm font-medium hover:underline">About your probability of success</a>
        </div>
      </div>
    </div>
  );
};

export default HouseholdSummary;