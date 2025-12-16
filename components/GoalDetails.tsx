import React from 'react';
import { Wallet, MapPin, Banknote, Info, CheckCircle2 } from 'lucide-react';

const GoalDetails: React.FC = () => {
  return (
    <div className="mt-12 pt-12 border-t border-slate-200">
      {/* GOAL DETAILS HEADER */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Goal Details
        </h3>
        <p className="text-slate-600">
          Your goals are important, so let's check to see if your goal information is accurate.
        </p>
      </div>

      {/* THREE COLUMN GRID */}
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
            <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-normal text-slate-900 mb-1">$966,890</div>
            <p className="text-slate-500 text-sm">from 7 out of 8 accounts</p>
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
             <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-slate-800">69</span>
              <span className="text-slate-600 text-sm">
                Your retirement age <span className="text-slate-400">(planning to 97)</span>
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-slate-800">67</span>
              <span className="text-slate-600 text-sm">
                Money Wise's retirement age <span className="text-slate-400">(planning to 97)</span>
              </span>
            </div>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-xl font-semibold text-slate-800">North Carolina</span>
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
            <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Edit</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">$10,666</span>
              <span className="text-slate-500 text-sm">/mo Essential expenses</span>
            </div>
             <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">$2,666</span>
              <span className="text-slate-500 text-sm">/mo Non-essential expenses</span>
            </div>
             <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-semibold text-slate-900">$13,332</span>
              <span className="text-slate-500 text-sm">/mo Total expenses</span>
            </div>

            <div className="pt-4 text-sm text-slate-500">
                Expense method: <span className="text-slate-600">Lifestyle</span>
            </div>
          </div>
        </div>

      </div>

      {/* STRATEGIES SECTION */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Your Strategies
        </h3>
        <p className="text-slate-600 mb-8 max-w-4xl">
          Your plan is key to helping you reach your retirement goals—examine your current contributions, investing style and retirement age.
        </p>

        {/* Top Banner Area */}
        <div className="mb-8">
            <h4 className="font-semibold text-slate-800 text-lg mb-2">
              You might be able to improve your retirement savings strategy
            </h4>
            <p className="text-slate-600 text-sm mb-4">
              Small shifts to where you're putting your savings could improve your retirement outlook.
            </p>
             <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-colors shadow-sm">
                Explore savings strategies
              </button>
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: Retirement Savings */}
            <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                     <h4 className="font-semibold text-slate-800 text-lg">Retirement savings</h4>
                     <Info size={16} className="text-slate-400 cursor-help" />
                </div>
                <div className="flex-grow">
                    <p className="text-slate-500 text-sm mb-1">Planned contributions</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl font-semibold text-slate-900">$50,360</span>
                        <span className="text-sm text-slate-500">yearly</span>
                    </div>
                </div>
                <button className="w-full bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors shadow-sm">
                    Explore retirement savings strategies
                </button>
            </div>

             {/* Card 2: Investments */}
            <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                     <h4 className="font-semibold text-slate-800 text-lg">Investments</h4>
                     <Info size={16} className="text-slate-400 cursor-help" />
                </div>
                <div className="flex-grow">
                    <p className="text-slate-500 text-sm mb-1">Target asset mix</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl font-semibold text-slate-900">Not selected</span>
                    </div>
                </div>
                <button className="w-full bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors shadow-sm">
                    Explore investment strategies
                </button>
            </div>

             {/* Card 3: Retirement Income */}
            <div className="bg-slate-50 p-6 rounded-sm border border-slate-100 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                     <h4 className="font-semibold text-slate-800 text-lg">Retirement income</h4>
                     <Info size={16} className="text-slate-400 cursor-help" />
                </div>
                <div className="flex-grow">
                    <p className="text-slate-500 text-sm mb-1">First year of retirement</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl font-semibold text-slate-900">$3,750</span>
                         <span className="text-sm text-slate-500">monthly</span>
                    </div>
                </div>
                <button className="w-full bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors shadow-sm">
                    Explore income strategies
                </button>
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
             </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;