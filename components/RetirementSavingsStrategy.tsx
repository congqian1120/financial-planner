import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AppData } from '../types';
import ContributionModeling, { ContributionState } from './ContributionModeling';
import ModeledContributionStrategy from './ModeledContributionStrategy';
import ModeledContributionTable from './ModeledContributionTable';

interface RetirementSavingsStrategyProps {
  data: AppData;
  onBack: () => void;
  onNavigate: (step: number) => void;
}

const RetirementSavingsStrategy: React.FC<RetirementSavingsStrategyProps> = ({ data, onBack, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [contributionState, setContributionState] = useState<ContributionState>({
    selectedAmount: 325,
    customAmount: ''
  });

  const { accounts } = data;
  const retirementAccounts = accounts.filter(a => a.goal === 'RETIREMENT');

  // Calculate contributions
  const userAnnualContribution = retirementAccounts.reduce((sum, acc) => sum + acc.contributions, 0);
  // Mock employer contribution (e.g. estimated match on 401k)
  const employerAnnualContribution = retirementAccounts
    .filter(a => a.type.includes('401K'))
    .reduce((sum, acc) => sum + (acc.contributions * 0.5), 0); // Assuming 50% match for demo

  const displayUser = viewMode === 'monthly' ? userAnnualContribution / 12 : userAnnualContribution;
  const displayEmployer = viewMode === 'monthly' ? employerAnnualContribution / 12 : employerAnnualContribution;
  
  // Categorize for Chart
  let taxDeferred = 0;
  let taxable = 0;
  let taxExempt = 0;
  let hsa = 0;

  retirementAccounts.forEach(acc => {
    // Basic heuristic for account types based on name/type
    const typeUpper = acc.type.toUpperCase();
    const contribution = acc.contributions; 
    
    // We strictly care about where contributions are going
    if (contribution > 0) {
        if (typeUpper.includes('HEALTH') || typeUpper.includes('HSA')) {
            hsa += contribution;
        } else if (typeUpper.includes('ROTH')) {
            taxExempt += contribution;
        } else if (typeUpper.includes('401K') || typeUpper.includes('IRA')) {
            taxDeferred += contribution;
        } else {
            taxable += contribution;
        }
    }
  });

  // If employer contributions exist, they are typically tax deferred (pre-tax 401k match)
  taxDeferred += employerAnnualContribution;

  const totalContributions = taxDeferred + taxable + taxExempt + hsa;

  const categories = [
    { name: 'Tax-deferred accounts', value: taxDeferred, color: '#65a30d' },   // Green
    { name: 'Taxable accounts', value: taxable, color: '#0ea5e9' },        // Blue
    { name: 'Tax-exempt accounts', value: taxExempt, color: '#eab308' },   // Yellow
    { name: 'Health savings accounts', value: hsa, color: '#9333ea' },     // Purple
  ];

  // For the chart, we only want slices that have value
  const chartData = categories.filter(c => c.value > 0);

  // If no contributions, show a placeholder grey ring
  const isEmpty = totalContributions === 0;
  const displayChartData = isEmpty ? [{ name: 'None', value: 1, color: '#e2e8f0' }] : chartData;

  // Calculate effective additional monthly contribution from state
  const additionalMonthly = contributionState.selectedAmount === -1 
      ? parseFloat(contributionState.customAmount.replace(/,/g, '')) || 0
      : contributionState.selectedAmount;

  return (
    <div className="bg-white min-h-full p-4 md:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 pb-24">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Retirement Analysis
      </button>

      <h1 className="text-3xl font-normal text-slate-800 mb-4">Retirement savings strategy</h1>
      
      <p className="text-slate-600 text-sm leading-relaxed max-w-5xl mb-8">
        Explore how contributing more or changing how you're spreading your contributions across accounts could impact your retirement income. These retirement savings calculators and modeling are hypothetical in nature and do not reflect actual investment results or guarantee future results. All investing strategies do not constitute a recommendation or solicitation of any particular investment strategy, or action and are provided for educational purposes only.
      </p>

      <div className="mb-12">
          <span className="text-sm font-bold text-slate-700 mr-4">View contributions as:</span>
          <div className="inline-flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="viewMode" 
                    checked={viewMode === 'monthly'} 
                    onChange={() => setViewMode('monthly')}
                    className="w-4 h-4 text-green-700 focus:ring-green-700 border-gray-300 accent-green-700"
                  />
                  <span className="text-sm text-slate-700">Monthly</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="viewMode" 
                    checked={viewMode === 'yearly'} 
                    onChange={() => setViewMode('yearly')}
                    className="w-4 h-4 text-green-700 focus:ring-green-700 border-gray-300 accent-green-700"
                  />
                  <span className="text-sm text-slate-700">Yearly</span>
              </label>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 border-t border-slate-200 pt-12">
        {/* Left Column: Amounts */}
        <div className="bg-slate-50 p-6 rounded-sm border border-slate-100/50">
            <h2 className="text-lg font-bold text-slate-800 mb-6">How much you're currently contributing</h2>
            
            <h3 className="text-sm font-bold text-slate-700 mb-6">
                {viewMode === 'monthly' ? 'Monthly' : 'Annual'} retirement contributions
            </h3>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end gap-2">
                    <div className="text-sm text-slate-600 font-normal mb-1">Your contributions</div>
                    <div className="flex-grow border-b border-slate-300 mb-1.5"></div>
                    <div className="text-lg font-normal text-slate-800">
                        ${displayUser.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                </div>
                
                <div className="flex justify-between items-end gap-2">
                    <div className="text-sm text-slate-600 font-normal mb-1">Your employer contributions</div>
                    <div className="flex-grow border-b border-slate-300 mb-1.5"></div>
                    <div className="text-lg font-normal text-slate-800">
                         ${displayEmployer.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                </div>
            </div>

            <p className="text-xs text-slate-500">
                If this is incorrect, please <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(3); }} className="text-blue-700 hover:underline cursor-pointer">update your retirement goal information.</a>
            </p>
        </div>

        {/* Right Column: Chart */}
        <div>
             <h2 className="text-lg font-bold text-slate-700 mb-8">Where you're currently contributing</h2>
             
             <div className="flex flex-col sm:flex-row items-center gap-12">
                <div className="w-40 h-40 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={displayChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={isEmpty ? 0 : 2}
                                dataKey="value"
                                stroke="none"
                            >
                                {displayChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            {!isEmpty && (
                              <Tooltip 
                                  formatter={(value: number) => `$${value.toLocaleString()}`}
                                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', fontSize: '12px' }}
                              />
                            )}
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4 flex-1 w-full">
                    {categories.map((item, idx) => {
                         const percentage = totalContributions > 0 ? Math.round((item.value / totalContributions) * 100) : 0;
                         const isZero = percentage === 0;
                         
                         return (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className={`underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help ${isZero ? 'text-slate-500 italic' : 'text-slate-600'}`}>
                                      {item.name}
                                    </span>
                                </div>
                                <span className={`font-medium ${isZero ? 'text-slate-400' : 'text-slate-800'}`}>{percentage}%</span>
                            </div>
                         );
                    })}
                </div>
             </div>
        </div>
      </div>
      
      {/* Modeling Components */}
      <ContributionModeling 
        data={data} 
        state={contributionState} 
        onChange={setContributionState} 
      />

      <ModeledContributionStrategy 
        currentBreakdown={{ taxDeferred, taxable, taxExempt, hsa }}
        additionalContribution={additionalMonthly}
      />

      <ModeledContributionTable 
        currentBreakdown={{ taxDeferred, taxable, taxExempt, hsa }}
        additionalContribution={additionalMonthly}
        onUpdatePlan={() => onNavigate(3)}
      />
    </div>
  );
};

export default RetirementSavingsStrategy;