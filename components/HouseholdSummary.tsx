import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { X, ExternalLink } from 'lucide-react';

const HouseholdSummary: React.FC = () => {
  const [showProbabilityModal, setShowProbabilityModal] = useState(false);

  // Simplified data for the small widget
  const gaugeData = [
    { name: 'Low', value: 1, color: '#a78bfa' },   // Lighter Purple
    { name: 'Mid', value: 1, color: '#2dd4bf' },   // Teal
    { name: 'High', value: 1, color: '#22c55e' },  // Green
  ];

  // Detailed data for the modal gauge
  // Bands: 0-24, 25-49, 50-74, 75-89, 90+
  const modalGaugeData = [
    { name: '0-24%', value: 24, color: '#4c1d95' }, // Deep Purple
    { name: '25-49%', value: 25, color: '#7c3aed' }, // Purple
    { name: '50-74%', value: 25, color: '#2dd4bf' }, // Teal
    { name: '75-89%', value: 15, color: '#4ade80' }, // Light Green
    { name: '90%+', value: 11, color: '#15803d' },   // Dark Green
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
              <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Rich Wise</h4>
              <div className="text-slate-600 text-sm mt-1">Age 33 | Currently working</div>
              <div className="text-slate-400 text-xs mt-1 lowercase">yearly income</div>
            </div>
            <div className="text-slate-900 font-medium text-lg tracking-tight">$158,000</div>
          </div>

          {/* Person 2 */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Money Wise</h4>
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
            <button 
              onClick={() => setShowProbabilityModal(true)}
              className="text-blue-700 text-sm font-medium hover:underline focus:outline-none"
            >
              About your probability of success
            </button>
        </div>
      </div>

      {/* Probability of Success Modal */}
      {showProbabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowProbabilityModal(false)}
          ></div>
          
          <div className="relative bg-white rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 pb-2 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Your plan's probability of success</h2>
              <button 
                onClick={() => setShowProbabilityModal(false)}
                className="text-slate-500 hover:text-slate-800 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-slate-100"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-8 pt-2">
              {/* Chart and Legend Section */}
              <div className="flex flex-col md:flex-row gap-12 mb-12 items-center border-b border-slate-100 pb-8">
                {/* Gauge Chart */}
                <div className="relative w-64 h-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modalGaugeData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {modalGaugeData.map((entry, index) => (
                          <Cell key={`cell-modal-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
                    <span className="text-4xl font-bold text-slate-900 leading-none">99%</span>
                    <span className="text-sm text-slate-600 font-medium mt-1">Probability of success</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1">
                   <h3 className="font-bold text-slate-800 mb-4 text-sm">Probability of success bands</h3>
                   <div className="space-y-3">
                      {modalGaugeData.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                           <span className="text-slate-600 text-sm font-medium">{item.name}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                
                {/* Section 1 */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-base">How are you doing?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    Your plan has a 99% probability of success in creating the $12,947 of monthly income we estimate you may need in retirement.
                  </p>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    This means <strong className="font-bold">you're likely well set for your planned retirement.</strong> Congrats!
                  </p>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    It also means you might have a few things to consider.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-base">What could you consider?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    Although you could likely stay on this course with peace-of-mind, you might think about:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li>Stress-testing your plan to see how well prepared you are for the unexpected</li>
                    <li>Shifting a small portion of your retirement contributions toward another goal</li>
                    <li>Updating your plan to retire sooner</li>
                    <li>Updating your plan to increase your spending in retirement</li>
                    <li>Planning to leave more of a legacy for your family or charitable causes</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-base">How much monthly income could you have in retirement?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    The amount of monthly income your current plan will create depends on how markets perform. We estimate you may need $12,947 monthly in retirement. Our hypothetical projections show that you could have these estimated amounts:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li>$25,693 monthly if markets perform significantly below average</li>
                    <li>$39,652 monthly if markets perform below average</li>
                    <li>$76,142 monthly if markets perform on average</li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div className="bg-slate-50 p-6 rounded border border-slate-100">
                   <h3 className="font-bold text-slate-800 mb-3 text-sm">How did we calculate your probability of success?</h3>
                   <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                     We ran 250 market simulations to project how much monthly income you could have throughout your retirement.
                   </p>
                   <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                     In 248 of those 250 market simulations (99%), your plan was successful in creating at least the $12,947 monthly you may need.
                   </p>
                   <a href="#" className="text-blue-700 text-sm font-medium hover:underline inline-flex items-center gap-1">
                     Read the full methodology <ExternalLink size={12} />
                   </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdSummary;