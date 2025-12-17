import React, { useState } from 'react';
import { Wallet, MapPin, Banknote, Info, CheckCircle2, BookOpen, User, PieChart, X, AlertCircle } from 'lucide-react';
import { AppData } from '../types';
import { calculateExpenses } from './RetirementExpenses';

interface GoalDetailsProps {
  data: AppData;
  onNavigate: (step: number) => void;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ data, onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { retirement, accounts, household, income } = data;

  // Derived Calculations
  const totalSaved = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.value, 0);
  const totalContributions = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.contributions, 0);
  const assignedAccountsCount = accounts.filter(a => a.goal === 'RETIREMENT').length;
  
  const expenses = calculateExpenses(data.expenses);

  const lifetimeIncome = income.socialSecurity.amount + income.pension + income.annuity;

  return (
    <div className="mt-12 pt-12 border-t border-slate-200 relative">
      {/* GOAL DETAILS HEADER */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Goal Details
        </h3>
        <p className="text-slate-600">
          Your goals are important, so let's check to see if your goal information is accurate.
        </p>
      </div>

      {/* THREE COLUMN GRID - SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        {/* COLUMN 1: TOTAL SAVED */}
        <div className="bg-slate-50 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-700">
                <Wallet size={20} />
              </div>
              <span className="font-semibold text-slate-700 text-lg">Total saved</span>
            </div>
            <button onClick={() => onNavigate(3)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-normal text-slate-900 mb-1">${totalSaved.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            <p className="text-slate-500 text-sm">from {assignedAccountsCount} out of {accounts.length} accounts</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between text-sm text-slate-600">
              <span>Tax deferred account</span>
              <div className="flex-grow mx-2 border-b border-dotted border-slate-300 mb-1"></div>
              <span className="font-medium">48%</span>
            </div>
            <div className="flex items-end justify-between text-sm text-slate-600">
              <span>Taxable account</span>
              <div className="flex-grow mx-2 border-b border-dotted border-slate-300 mb-1"></div>
              <span className="font-medium">40%</span>
            </div>
            <div className="flex items-end justify-between text-sm text-slate-600">
              <span>Tax exempt account</span>
              <div className="flex-grow mx-2 border-b border-dotted border-slate-300 mb-1"></div>
              <span className="font-medium">13%</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: RETIREMENT PROFILE */}
        <div className="bg-slate-50 p-6 rounded-sm">
           <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-700">
                 <MapPin size={20} />
              </div>
              <span className="font-semibold text-slate-700 text-lg">Retirement profile</span>
            </div>
             <button onClick={() => onNavigate(1)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-slate-800">{retirement.retirementAge}</span>
              <span className="text-slate-600 text-sm">
                Your retirement age <span className="text-slate-400">(planning to {retirement.planToAge})</span>
              </span>
            </div>
            {household.planningWithPartner && (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-slate-800">{retirement.partnerRetirementAge}</span>
                <span className="text-slate-600 text-sm">
                  {household.partnerName}'s retirement age <span className="text-slate-400">(planning to {retirement.planToAge})</span>
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-xl font-semibold text-slate-800">{retirement.state}</span>
              <span className="text-slate-500 text-sm">Retirement state</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: EXPENSES */}
        <div className="bg-slate-50 p-6 rounded-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-700">
                <Banknote size={20} />
              </div>
              <span className="font-semibold text-slate-700 text-lg">Expenses</span>
            </div>
            <button onClick={() => onNavigate(2)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">${expenses.essential.toLocaleString()}</span>
              <span className="text-slate-500 text-sm">/mo Essential expenses</span>
            </div>
             <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">${expenses.discretionary.toLocaleString()}</span>
              <span className="text-slate-500 text-sm">/mo Non-essential expenses</span>
            </div>
             <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-semibold text-slate-900">${expenses.total.toLocaleString()}</span>
              <span className="text-slate-500 text-sm">/mo Total expenses</span>
            </div>

            <div className="pt-4 text-sm text-slate-500">
                Expense method: <span className="text-slate-600 capitalize">{data.expenses.method === 'basic' ? 'Lifestyle' : data.expenses.method}</span>
            </div>
          </div>
        </div>

      </div>

      {/* STRATEGIES SECTION */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          YOUR STRATEGIES
        </h3>
        <p className="text-slate-600 mb-8 max-w-4xl">
          Your plan is key to helping you reach your retirement goals—examine your current contributions, investing mix, and income mix below.
        </p>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Retirement savings */}
          <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-slate-800 text-sm">Retirement savings</h4>
                <Info size={16} className="text-slate-400 cursor-help" />
            </div>
            
            <div className="mb-8">
              <p className="text-sm text-slate-600 mb-1">Planned contributions</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-slate-800">${totalContributions.toLocaleString()}</span>
                <span className="text-xs text-slate-600">yearly</span>
              </div>
            </div>

            <div className="mt-auto">
               <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm">
                  Explore retirement savings strategies
               </button>
            </div>
          </div>

          {/* Card 2: Investments */}
          <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-slate-800 text-sm">Investments</h4>
                <Info size={16} className="text-slate-400 cursor-help" />
            </div>
            
            <div className="mb-8">
              <p className="text-sm text-slate-600 mb-1">Target asset mix</p>
              <div className="text-2xl font-semibold text-slate-800">Not selected</div>
            </div>

            <div className="mt-auto">
               <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm">
                  Explore investment strategies
               </button>
            </div>
          </div>

          {/* Card 3: Retirement income */}
          <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-slate-800 text-sm">Retirement income</h4>
                <Info size={16} className="text-slate-400 cursor-help" />
            </div>
            
            <div className="mb-8">
              <p className="text-sm text-slate-600 mb-1">First year of retirement</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-slate-800">${income.socialSecurity.amount.toLocaleString()}</span>
                <span className="text-xs text-slate-600">monthly</span>
              </div>
            </div>

            <div className="mt-auto">
               <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm">
                  Explore income strategies
               </button>
            </div>
          </div>
        </div>

        {/* Assess Plan For Risk Section */}
        <div>
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Assess your plan for risk
            </h3>
            <p className="text-slate-600 text-sm max-w-3xl mb-6">
                 We've looked at how your plan factors in the possibility of a few common risks that can sometimes make things complicated.
            </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-700 mt-0.5" />
                     <div>
                         <h5 className="font-semibold text-slate-700 text-sm mb-0.5">Spending</h5>
                         <p className="text-xs text-slate-500">Your plan appears to account for this risk</p>
                     </div>
                 </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-700 mt-0.5" />
                     <div>
                         <h5 className="font-semibold text-slate-700 text-sm mb-0.5">Longevity</h5>
                         <p className="text-xs text-slate-500">Your plan appears to account for this risk</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-700 mt-0.5" />
                     <div>
                         <h5 className="font-semibold text-slate-700 text-sm mb-0.5">Market volatility</h5>
                         <p className="text-xs text-slate-500">Your plan appears to account for this risk</p>
                     </div>
                 </div>
             </div>
             
             <button 
                onClick={() => setIsModalOpen(true)}
                className="text-blue-700 text-sm font-medium hover:underline focus:outline-none"
             >
                View risk details and action steps
             </button>
        </div>
      </div>

      {/* RISK ASSESSMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#fcfbf9] rounded-sm shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
             {/* Header */}
             <div className="flex justify-between items-start p-6 border-b border-slate-200 sticky top-0 bg-[#fcfbf9] z-10">
                <h2 className="text-xl font-bold text-slate-800">Risk assessment</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={24} className="text-slate-500" strokeWidth={1.5} />
                </button>
             </div>
             
             <div className="p-6 md:p-8 space-y-8 bg-[#fcfbf9]">
                 <p className="text-slate-700 text-sm leading-relaxed">
                    Based on what you've told us, we've assessed your retirement plan's exposure to four of the factors that we believe can significantly impact your income in retirement.
                 </p>

                 {/* Divider */}
                 <div className="w-full h-px bg-slate-300"></div>

                 {/* Spending - Green */}
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="fill-green-50 text-green-700" size={24} strokeWidth={2} />
                        <span className="font-bold text-slate-900 text-base">Spending</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        When it comes to your retirement expenses, you're going to find that they can be divided into two groups. Essential expenses are things that you wouldn't want to cut back on, while discretionary expenses are the things you can live without. Planning isn't only about how much you spend, it's about what portion of your expenses you classify as essential.
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        Most of your estimated expenses appear to be covered by your plan.
                    </p>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(2); // Retirement expenses (Step 2)
                        setIsModalOpen(false);
                      }}
                      className="text-sm text-blue-700 underline hover:no-underline inline-block font-medium"
                    >
                      Edit expenses
                    </a>
                 </div>

                 {/* Longevity - Yellow */}
                 <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2">
                        {/* Custom Yellow Icon - Yellow top, white bottom circle */}
                        <div 
                          className="w-6 h-6 rounded-full border border-[#ca8a04]"
                          style={{ background: 'linear-gradient(to bottom, #ca8a04 50%, white 50%)' }}
                        ></div>
                        <span className="font-bold text-slate-900 text-base">Longevity</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Today, there's a pretty good chance that people in good health could live into their 90's and beyond. We suggest you plan accordingly.
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                        Consider a planning age that accounts for the possibility that you may live into your 90s.
                    </p>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(0); // Household profile (Step 0)
                        setIsModalOpen(false);
                      }}
                      className="text-sm text-blue-700 underline hover:no-underline inline-block font-medium"
                    >
                      Edit plan to age
                    </a>
                 </div>

                 {/* Divider */}
                 <div className="w-full h-px bg-slate-300 mt-4"></div>

                 {/* Legend */}
                 <div>
                    <h4 className="font-bold text-slate-900 mb-4 text-sm">Legend</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                             <CheckCircle2 className="fill-green-50 text-green-700" size={18} strokeWidth={2} />
                             <span className="text-sm text-slate-600">Your plan appears to account for this risk</span>
                        </div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetails;