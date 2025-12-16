import React, { useState } from 'react';
import { CreditCard, ShoppingBag, PiggyBank, CheckSquare, Home, Zap, HeartPulse, Calculator, Pencil, Banknote } from 'lucide-react';

const RetirementExpenses: React.FC = () => {
  const [planningMethod, setPlanningMethod] = useState<'basic' | 'monthly' | 'detailed'>('basic');
  const [lifestyle, setLifestyle] = useState<'above' | 'average' | 'below'>('average');
  
  // State for Estimated Monthly Expenses inputs
  const [essentialInput, setEssentialInput] = useState<string>("1,000");
  const [nonEssentialInput, setNonEssentialInput] = useState<string>("0");

  const getMethodLabel = () => {
    switch (planningMethod) {
        case 'basic': return 'Lifestyle';
        case 'monthly': return 'Estimated';
        case 'detailed': return 'Detailed';
        default: return 'Lifestyle';
    }
  };

  // Helper to calculate totals based on method
  const getTotals = () => {
    if (planningMethod === 'monthly') {
        const essential = parseInt(essentialInput.replace(/,/g, '') || '0', 10);
        const nonEssential = parseInt(nonEssentialInput.replace(/,/g, '') || '0', 10);
        return {
            total: (essential + nonEssential).toLocaleString(),
            essential: essential.toLocaleString(),
            discretionary: nonEssential.toLocaleString(),
            discretionaryLabel: 'Non-essential'
        };
    }
    // Default/Basic values (static for now based on previous design)
    return {
        total: '10,924',
        essential: '8,739',
        discretionary: '2,185',
        discretionaryLabel: 'Discretionary'
    };
  };

  const totals = getTotals();

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-8 max-w-4xl animate-in fade-in duration-500 flex-1 overflow-y-auto pb-24">
        <div className="mb-8">
            <div className="text-sm text-slate-500 mb-4">Navigation</div>
            <h1 className="text-3xl font-normal text-slate-800 mb-10">Retirement expenses</h1>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="pl-4 py-4 pr-6 border-l-4 border-green-700 bg-white shadow-sm border-y border-r border-slate-200 rounded-r-sm">
                    <div className="text-sm font-semibold text-slate-600 mb-1">Expense method</div>
                    <div className="text-2xl font-normal text-slate-800">
                        {getMethodLabel()}
                    </div>
                </div>
                <div className="pl-4 py-4 pr-6 border-l-4 border-green-700 bg-white shadow-sm border-y border-r border-slate-200 rounded-r-sm">
                     <div className="text-sm font-semibold text-slate-600 mb-1">Total expenses</div>
                    <div className="text-2xl font-normal text-slate-800">${totals.total}<span className="text-base text-slate-500 font-normal">/mo</span></div>
                </div>
                <div className="pl-4 py-3 pr-6 border-l-4 border-green-700 bg-white shadow-sm border-y border-r border-slate-200 rounded-r-sm flex flex-col justify-center">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Breakdown</div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                             <span className="text-sm text-slate-600">Essential</span>
                             <span className="text-base font-semibold text-slate-800">${totals.essential}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                        </div>
                        <div className="flex justify-between items-baseline">
                             <span className="text-sm text-slate-600">{totals.discretionaryLabel}</span>
                             <span className="text-base font-semibold text-slate-800">${totals.discretionary}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Expenses Section */}
            <div className="mb-12">
                <h2 className="text-xl font-medium text-slate-800 mb-4">How would you like to plan your expenses?</h2>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-3xl">
                    How much you'll spend in retirement can be a critical element of your plan. While you don't need to be exact, we'll
                    account for all your expenses except income taxes. Choose how you'd like to enter your expenses based on your current lifestyle or a detailed budget.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Option 1: Basic */}
                    <div 
                        onClick={() => setPlanningMethod('basic')}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${planningMethod === 'basic' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${planningMethod === 'basic' ? 'border-green-700' : 'border-slate-400'}`}>
                            {planningMethod === 'basic' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Use Fidelity's basic estimate</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Give us an idea of the kind of lifestyle you'll lead in retirement and we'll provide an estimate for you.</p>
                        </div>
                    </div>

                    {/* Option 2: Monthly */}
                    <div 
                        onClick={() => setPlanningMethod('monthly')}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${planningMethod === 'monthly' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${planningMethod === 'monthly' ? 'border-green-700' : 'border-slate-400'}`}>
                             {planningMethod === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Estimated monthly expenses</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Tell us about what you think you'll spend in retirement at a high level, and we'll add that to your plan.</p>
                        </div>
                    </div>

                    {/* Option 3: Detailed */}
                    <div 
                        onClick={() => setPlanningMethod('detailed')}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${planningMethod === 'detailed' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${planningMethod === 'detailed' ? 'border-green-700' : 'border-slate-400'}`}>
                             {planningMethod === 'detailed' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Detailed expenses</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Itemize what you think you'll spend in retirement to help us create a more accurate picture.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifestyle Section */}
            {planningMethod === 'basic' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-medium text-slate-800 mb-1">Which of the following best describes your retirement spending?</h2>
                    <a href="#" className="text-sm text-blue-700 hover:underline mb-6 inline-block font-medium">How is this calculated?</a>

                    <div className="space-y-4 max-w-2xl">
                        {/* Above Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-5 border rounded-r-sm transition-all duration-200 ${lifestyle === 'above' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:bg-slate-50'}`}>
                             <div className="flex flex-col items-center gap-2 w-16 pt-1 shrink-0">
                                <Banknote size={24} className="text-slate-400" strokeWidth={1} />
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={lifestyle === 'above'} 
                                    onChange={() => setLifestyle('above')}
                                    className="peer h-4 w-4 mt-1 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Above average</h3>
                                <p className="text-sm text-slate-600 mb-4">I plan to live lavishly in retirement.</p>
                                
                                <p className="text-sm font-bold text-slate-700 mb-2">You might choose this option if</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>You expect to do some traveling in retirement.</span>
                                    </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>When shopping, the price isn't your primary consideration</span>
                                    </li>
                                </ul>
                            </div>
                        </label>

                         {/* Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-5 border rounded-r-sm transition-all duration-200 ${lifestyle === 'average' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:bg-slate-50'}`}>
                             <div className="flex flex-col items-center gap-2 w-16 pt-1 shrink-0">
                                <Banknote size={24} className="text-slate-400" strokeWidth={1} />
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={lifestyle === 'average'} 
                                    onChange={() => setLifestyle('average')}
                                    className="peer h-4 w-4 mt-1 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Average</h3>
                                <p className="text-sm text-slate-600 mb-4">I plan to live an average lifestyle.</p>

                                <p className="text-sm font-bold text-slate-700 mb-2">You might choose this option if</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>You think you'll travel, but not a lot more than you do now</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>When shopping, you're mindful of what's on sale</span>
                                    </li>
                                </ul>
                            </div>
                        </label>

                         {/* Below Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-5 border rounded-r-sm transition-all duration-200 ${lifestyle === 'below' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:bg-slate-50'}`}>
                             <div className="flex flex-col items-center gap-2 w-16 pt-1 shrink-0">
                                <Banknote size={24} className="text-slate-400" strokeWidth={1} />
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={lifestyle === 'below'} 
                                    onChange={() => setLifestyle('below')}
                                    className="peer h-4 w-4 mt-1 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Below average</h3>
                                <p className="text-sm text-slate-600 mb-4">I plan to spend as little money as possible to help my money last.</p>

                                <p className="text-sm font-bold text-slate-700 mb-2">You might choose this option if</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>You plan to minimize your expenses so your savings will last longer</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="text-green-700 mt-0.5"><CheckSquare size={18} strokeWidth={2} className="fill-green-50" /></div>
                                        <span>When shopping, price is the most important factor</span>
                                    </li>
                                </ul>
                            </div>
                        </label>
                    </div>
                </div>
            )}
            
            {/* Monthly Expenses Section */}
            {planningMethod === 'monthly' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-medium text-slate-800 mb-2">How would you like to plan your expenses?</h2>
                    <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-4xl">
                        If you're not exactly sure what you'll be spending in retirement, that's OK. Let's start with estimates for now. You can always provide more detail later.
                    </p>

                    <div className="max-w-4xl">
                        {/* Header */}
                        <div className="flex justify-between border-b border-slate-200 pb-2 mb-4">
                            <span className="font-bold text-slate-800 text-sm">Category</span>
                            <span className="font-bold text-slate-800 text-sm">Cost per month</span>
                        </div>

                        {/* Essential Expenses */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8">
                            <div className="max-w-2xl">
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Essential expenses</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    This refers to things that you can't live without, like food, mortgage, utilities, and health care, which, if you could not afford would be willing to either continue working or go back to work to pay for.
                                </p>
                            </div>
                            <div className="relative w-32 shrink-0">
                                <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                                <input 
                                    type="text" 
                                    value={essentialInput}
                                    onChange={(e) => setEssentialInput(e.target.value)}
                                    className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-right" 
                                />
                            </div>
                        </div>

                        {/* Non-essential Expenses */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8 border-b border-slate-200 pb-8">
                            <div className="max-w-2xl">
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Non-essential expenses</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Additional expenses that you could live without.
                                </p>
                            </div>
                            <div className="relative w-32 shrink-0">
                                <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                                <input 
                                    type="text" 
                                    value={nonEssentialInput}
                                    onChange={(e) => setNonEssentialInput(e.target.value)}
                                    className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-right" 
                                />
                            </div>
                        </div>

                        {/* Footer text */}
                        <p className="text-xs text-slate-500 leading-relaxed">
                            We assume a general average annual inflation rate of 2.5%, with the exception of health care costs. The inflation rate for those is based on a schedule of rates that starts at 4.9% and gradually declines until it matches the general inflation rate.
                        </p>
                    </div>
                </div>
            )}

            {/* Detailed Expenses Section */}
            {planningMethod === 'detailed' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                     <h2 className="text-xl font-medium text-slate-800 mb-2">Provide a more detailed accounting of your expenses</h2>
                     <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-4xl">
                        If you're already retired, or close to retirement, and have a good handle on your retirement expenses, use the fields below or provide a more detailed view of your spending. If you have an expense that's not included in the category list below, you can use the Custom expense category. Zero amounts or asterisks (*) indicate that the number is expected to vary throughout your retirement.
                     </p>

                     <h3 className="text-lg font-medium text-slate-800 mb-1">Detailed Budget Worksheet</h3>
                     <p className="text-xs text-slate-500 mb-6">Enter your monthly budget in retirement by category and sub-category</p>

                     <div className="bg-slate-50 border border-slate-200 rounded-sm max-w-4xl">
                        {/* Housing & mortgage */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                     <Home size={20} />
                                 </div>
                                 <span className="font-bold text-slate-700 text-base">Housing & mortgage</span>
                             </div>
                             <div className="flex items-center gap-6">
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Calculator size={20} />
                                 </button>
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Pencil size={20} />
                                 </button>
                             </div>
                        </div>

                        {/* Utilities */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                     <Zap size={20} />
                                 </div>
                                 <span className="font-bold text-slate-700 text-base">Utilities</span>
                             </div>
                             <div className="flex items-center gap-6">
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Calculator size={20} />
                                 </button>
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Pencil size={20} />
                                 </button>
                             </div>
                        </div>

                         {/* Health care & insurance */}
                        <div className="flex items-center justify-between p-6">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                     <HeartPulse size={20} />
                                 </div>
                                 <span className="font-bold text-slate-700 text-base">Health care & insurance</span>
                             </div>
                             <div className="flex items-center gap-6">
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Calculator size={20} />
                                 </button>
                                 <button className="text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                    <Pencil size={20} />
                                 </button>
                             </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>

       {/* Footer */}
       <div className="border-t border-slate-200 p-4 bg-white flex justify-between sticky bottom-0 z-20">
             <button className="text-slate-600 font-bold py-2 px-8 hover:bg-slate-50 rounded-full transition-colors text-sm">
                Previous
            </button>
             <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
    </div>
  );
};

export default RetirementExpenses;