
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { X, ExternalLink } from 'lucide-react';
import { AppData } from '../types';

interface HouseholdSummaryProps {
  data: AppData;
  summaryStats?: {
    avgMonthlyIncome: number;
    belowAvgMonthlyIncome: number;
    sigBelowAvgMonthlyIncome: number;
    monthlyNeed: number;
  };
}

const HouseholdSummary: React.FC<HouseholdSummaryProps> = ({ data, summaryStats }) => {
  const [showProbabilityModal, setShowProbabilityModal] = useState(false);
  const { household } = data;

  const gaugeData = [
    { name: 'Low', value: 1, color: '#a78bfa' },   
    { name: 'Mid', value: 1, color: '#2dd4bf' },   
    { name: 'High', value: 1, color: '#22c55e' },  
  ];

  const modalGaugeData = [
    { name: '0-24%', value: 24, color: '#4c1d95' }, 
    { name: '25-49%', value: 25, color: '#7c3aed' }, 
    { name: '50-74%', value: 25, color: '#2dd4bf' }, 
    { name: '75-89%', value: 15, color: '#4ade80' }, 
    { name: '90%+', value: 11, color: '#15803d' },   
  ];

  const monthlyNeed = summaryStats?.monthlyNeed || 0;
  const incomeHave = summaryStats?.sigBelowAvgMonthlyIncome || 0;
  const excess = incomeHave - monthlyNeed;

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8 border-t border-slate-200 pt-8">
      <div className="flex-1 bg-slate-50 p-6 rounded-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">
          Household profile
        </h3>

        <div className="space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">{household.name}</h4>
              <div className="text-slate-600 text-sm mt-1">Age 33 | Currently working</div>
              <div className="text-slate-400 text-xs mt-1 lowercase">yearly income</div>
            </div>
            <div className="text-slate-900 font-medium text-lg tracking-tight">${(household.income + household.bonus).toLocaleString()}</div>
          </div>

          {household.planningWithPartner && (
            <div className="flex justify-between items-center">
                <div>
                <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">{household.partnerName}</h4>
                <div className="text-slate-600 text-sm mt-1">Age 31 | Currently working</div>
                <div className="text-slate-400 text-xs mt-1 lowercase">yearly income</div>
                </div>
                <div className="text-slate-900 font-medium text-lg tracking-tight">${(household.partnerIncome + household.partnerBonus).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

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
                    {excess >= 0 
                      ? `Consider that even in a significantly below average market, your plan could create $${excess.toLocaleString()} more than the monthly income we estimate you may need.`
                      : `In a significantly below average market, you may face a shortfall of $${Math.abs(excess).toLocaleString()} compared to your monthly needs.`
                    }
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

      {showProbabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowProbabilityModal(false)}></div>
          <div className="relative bg-white rounded shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-start p-6 pb-2 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Your plan's probability of success</h2>
              <button onClick={() => setShowProbabilityModal(false)} className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"><X size={24} strokeWidth={1.5} /></button>
            </div>

            <div className="p-8 pt-2">
              <div className="flex flex-col md:flex-row gap-12 mb-12 items-center border-b border-slate-100 pb-8">
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

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-base">How are you doing?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    Your plan has a 99% probability of success in creating the ${monthlyNeed.toLocaleString()} of monthly income we estimate you may need in retirement (in <strong>today's dollars</strong>).
                  </p>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    This means <strong className="font-bold">you're likely well set for your planned retirement.</strong>
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-base">How much monthly income could you have in retirement?</h3>
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    The amount of monthly income your current plan will create depends on market performance. Adjusted for inflation, we estimate:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li>${summaryStats?.sigBelowAvgMonthlyIncome.toLocaleString()} monthly in a significantly below average market</li>
                    <li>${summaryStats?.belowAvgMonthlyIncome.toLocaleString()} monthly in a below average market</li>
                    <li>${summaryStats?.avgMonthlyIncome.toLocaleString()} monthly in an average market</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded border border-slate-100">
                   <h3 className="font-bold text-slate-800 mb-3 text-sm">About "Today's Dollars"</h3>
                   <p className="text-slate-700 text-sm leading-relaxed">
                     All figures above are shown in today's dollars, meaning they are adjusted for estimated inflation. This allows you to plan based on what your money can buy today, rather than a nominal future value that might be less meaningful.
                   </p>
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
