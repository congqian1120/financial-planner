import React, { useState } from 'react';
import { CreditCard, ShoppingBag, PiggyBank, CheckSquare, Home, Zap, HeartPulse, Calculator, Pencil, Banknote, Car, User, Ticket, FileText, Users, Droplets, Smile, CheckCircle2 } from 'lucide-react';
import { AppData } from '../types';

interface RetirementExpensesProps {
  data: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

// Calculations helper exportable if needed, or just kept internal but used in render
export const calculateExpenses = (expenses: AppData['expenses']) => {
    if (expenses.method === 'monthly') {
        return {
            total: expenses.essential + expenses.nonEssential,
            essential: expenses.essential,
            discretionary: expenses.nonEssential,
            discretionaryLabel: 'Non-essential'
        };
    }
    if (expenses.method === 'detailed') {
        const total = Object.values(expenses.detailed).reduce((acc: number, val: number) => acc + val, 0);
        return {
            total: total,
            essential: total, // Assuming detailed are all essential for now or split them if needed
            discretionary: 0,
            discretionaryLabel: 'Non-essential'
        };
    }
    
    // Basic/Lifestyle Method
    let basicTotal = 0;
    let basicEssential = 0;
    let basicDiscretionary = 0;

    switch (expenses.lifestyle) {
        case 'below':
            basicTotal = 4100;
            basicEssential = 3280; 
            basicDiscretionary = 820; 
            break;
        case 'average':
            basicTotal = 6800;
            basicEssential = 4760;
            basicDiscretionary = 2040;
            break;
        case 'above':
            basicTotal = 12500;
            basicEssential = 7500;
            basicDiscretionary = 5000;
            break;
        default:
            basicTotal = 6800;
            basicEssential = 4760;
            basicDiscretionary = 2040;
    }

    return {
        total: basicTotal,
        essential: basicEssential,
        discretionary: basicDiscretionary,
        discretionaryLabel: 'Discretionary'
    };
};

const RetirementExpenses: React.FC<RetirementExpensesProps> = ({ data, updateData, onNext, onPrevious }) => {
  const { expenses } = data;
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const updateExpenses = (updates: Partial<typeof expenses>) => {
    updateData({ expenses: { ...expenses, ...updates } });
  };

  const totals = calculateExpenses(expenses);

  const getMethodLabel = () => {
    switch (expenses.method) {
        case 'basic': return 'Lifestyle';
        case 'monthly': return 'Estimated';
        case 'detailed': return 'Detailed';
        default: return 'Lifestyle';
    }
  };

  const handleDetailedChange = (category: string, value: string) => {
    // Only allow digits
    const cleanValue = parseInt(value.replace(/,/g, '') || '0', 10);
    if (!isNaN(cleanValue)) {
        updateExpenses({
            detailed: {
                ...expenses.detailed,
                [category]: cleanValue
            }
        });
    }
  };

  const detailedCategories = [
    { name: 'Housing & mortgage', icon: Home },
    { name: 'Utilities', icon: Droplets },
    { name: 'Health care & insurance', icon: HeartPulse },
    { name: 'Transportation', icon: Car },
    { name: 'Personal', icon: User },
    { name: 'Recreation', icon: Smile },
    { name: 'Entertainment', icon: Ticket },
    { name: 'Custom expenses', icon: FileText },
    { name: 'Family care', icon: Users },
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-white">
      <div className="p-8 max-w-4xl animate-in fade-in duration-500 flex-1 pb-24">
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
                    <div className="text-2xl font-normal text-slate-800">${totals.total.toLocaleString()}<span className="text-base text-slate-500 font-normal">/mo</span></div>
                </div>
                <div className="pl-4 py-3 pr-6 border-l-4 border-green-700 bg-white shadow-sm border-y border-r border-slate-200 rounded-r-sm flex flex-col justify-center">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Breakdown</div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                             <span className="text-sm text-slate-600">Essential</span>
                             <span className="text-base font-semibold text-slate-800">${totals.essential.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
                        </div>
                        <div className="flex justify-between items-baseline">
                             <span className="text-sm text-slate-600">{totals.discretionaryLabel}</span>
                             <span className="text-base font-semibold text-slate-800">${totals.discretionary.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span></span>
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
                        onClick={() => updateExpenses({ method: 'basic' })}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${expenses.method === 'basic' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${expenses.method === 'basic' ? 'border-green-700' : 'border-slate-400'}`}>
                            {expenses.method === 'basic' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Use Fidelity's basic estimate</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Give us an idea of the kind of lifestyle you'll lead in retirement and we'll provide an estimate for you.</p>
                        </div>
                    </div>

                    {/* Option 2: Monthly */}
                    <div 
                        onClick={() => updateExpenses({ method: 'monthly' })}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${expenses.method === 'monthly' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${expenses.method === 'monthly' ? 'border-green-700' : 'border-slate-400'}`}>
                             {expenses.method === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Estimated monthly expenses</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Tell us about what you think you'll spend in retirement at a high level, and we'll add that to your plan.</p>
                        </div>
                    </div>

                    {/* Option 3: Detailed */}
                    <div 
                        onClick={() => updateExpenses({ method: 'detailed' })}
                        className={`cursor-pointer p-4 border rounded-r-sm relative flex gap-3 transition-all duration-200 ${expenses.method === 'detailed' ? 'border-l-4 border-l-green-700 border-y border-r border-slate-300 bg-[#f0fdf4] shadow-sm' : 'border border-slate-300 hover:border-slate-400 bg-white'}`}
                    >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${expenses.method === 'detailed' ? 'border-green-700' : 'border-slate-400'}`}>
                             {expenses.method === 'detailed' && <div className="w-2.5 h-2.5 rounded-full bg-green-700" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1 text-sm">Detailed expenses</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Itemize what you think you'll spend in retirement to help us create a more accurate picture.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifestyle Section */}
            {expenses.method === 'basic' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-xl font-medium text-slate-800 mb-1">Which of the following best describes your retirement spending?</h2>
                    <a href="#" className="text-sm text-blue-700 hover:underline mb-6 inline-block font-medium">How is this calculated?</a>

                    <div className="space-y-4 max-w-3xl">
                        {/* Above Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-6 border rounded-sm transition-all duration-200 ${expenses.lifestyle === 'above' ? 'border-green-700 bg-white shadow-sm ring-1 ring-green-700' : 'border-slate-300 hover:border-slate-400 bg-white'}`}>
                             <div className="flex flex-col items-center gap-1.5 w-8 pt-1 shrink-0">
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={expenses.lifestyle === 'above'} 
                                    onChange={() => updateExpenses({ lifestyle: 'above' })}
                                    className="peer h-5 w-5 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Above average</h3>
                                <p className="text-sm text-slate-600 mb-5">I plan to live lavishly in retirement.</p>
                                
                                <div className="text-sm font-bold text-slate-800 mb-2">You might choose this option if</div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">You expect to do extensive traveling in retirement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">When shopping, the price isn't your primary consideration</span>
                                    </li>
                                </ul>
                            </div>
                        </label>

                         {/* Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-6 border rounded-sm transition-all duration-200 ${expenses.lifestyle === 'average' ? 'border-green-700 bg-white shadow-sm ring-1 ring-green-700' : 'border-slate-300 hover:border-slate-400 bg-white'}`}>
                             <div className="flex flex-col items-center gap-1.5 w-8 pt-1 shrink-0">
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={expenses.lifestyle === 'average'} 
                                    onChange={() => updateExpenses({ lifestyle: 'average' })}
                                    className="peer h-5 w-5 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Average</h3>
                                <p className="text-sm text-slate-600 mb-5">I plan to live an average lifestyle.</p>
                                
                                <div className="text-sm font-bold text-slate-800 mb-2">You might choose this option if</div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">You think you'll travel, but not a lot more than you do now</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">When shopping, you're mindful of what's on sale</span>
                                    </li>
                                </ul>
                            </div>
                        </label>

                         {/* Below Average */}
                        <label className={`cursor-pointer flex items-start gap-4 p-6 border rounded-sm transition-all duration-200 ${expenses.lifestyle === 'below' ? 'border-green-700 bg-white shadow-sm ring-1 ring-green-700' : 'border-slate-300 hover:border-slate-400 bg-white'}`}>
                             <div className="flex flex-col items-center gap-1.5 w-8 pt-1 shrink-0">
                                <input 
                                    type="radio" 
                                    name="lifestyle" 
                                    checked={expenses.lifestyle === 'below'} 
                                    onChange={() => updateExpenses({ lifestyle: 'below' })}
                                    className="peer h-5 w-5 border-gray-300 text-green-700 focus:ring-green-700 accent-green-700" 
                                />
                                <span className="text-[10px] text-slate-500 font-medium">Select</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-base mb-1">Below average</h3>
                                <p className="text-sm text-slate-600 mb-5">I plan to spend as little money as possible to help my money last.</p>
                                
                                <div className="text-sm font-bold text-slate-800 mb-2">You might choose this option if</div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">You plan to limit travel expenses to your visits with loved ones</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <span className="text-sm text-slate-600">When shopping, you purchase generic brands whenever possible</span>
                                    </li>
                                </ul>
                            </div>
                        </label>
                    </div>
                </div>
            )}
            
            {/* Monthly Expenses Section */}
            {expenses.method === 'monthly' && (
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
                                    value={expenses.essential}
                                    onChange={(e) => updateExpenses({ essential: parseInt(e.target.value) || 0 })}
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
                                    value={expenses.nonEssential}
                                    onChange={(e) => updateExpenses({ nonEssential: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-right" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Expenses Section */}
            {expenses.method === 'detailed' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                     <h2 className="text-xl font-medium text-slate-800 mb-2">Provide a more detailed accounting of your expenses</h2>
                     <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-4xl">
                        If you're already retired, or close to retirement, and have a good handle on your retirement expenses, use the fields below or provide a more detailed view of your spending.
                     </p>

                     <h3 className="text-lg font-medium text-slate-800 mb-1">Detailed Budget Worksheet</h3>
                     <p className="text-xs text-slate-500 mb-6">Itemize your monthly budget in retirement by category and sub-category</p>

                     <div className="bg-slate-50 border border-slate-200 rounded-sm max-w-4xl">
                        {detailedCategories.map((cat, index) => (
                            <div key={index} className={`flex items-center justify-between p-6 ${index !== detailedCategories.length - 1 ? 'border-b border-slate-200' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <cat.icon size={20} />
                                    </div>
                                    <span className="font-bold text-slate-700 text-base">{cat.name}</span>
                                </div>
                                <div className="flex items-center justify-end min-w-[120px]">
                                    {editingCategory === cat.name ? (
                                         <div className="relative w-32 animate-in fade-in duration-200">
                                            <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                                            <input 
                                                autoFocus
                                                type="text" 
                                                value={expenses.detailed[cat.name]}
                                                onChange={(e) => handleDetailedChange(cat.name, e.target.value)}
                                                onBlur={() => setEditingCategory(null)}
                                                onKeyDown={(e) => { if(e.key === 'Enter') setEditingCategory(null) }}
                                                className="w-full border border-blue-500 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none ring-1 ring-blue-500 shadow-sm text-right bg-white" 
                                            />
                                        </div>
                                    ) : (
                                        <div 
                                            className="flex items-center gap-4 cursor-pointer group p-2 -mr-2 rounded hover:bg-slate-100 transition-colors" 
                                            onClick={() => setEditingCategory(cat.name)}
                                        >
                                            <div className="text-slate-600 font-medium group-hover:text-slate-900">${expenses.detailed[cat.name].toLocaleString()}</div>
                                            <button className="text-slate-400 group-hover:text-blue-600 flex items-center justify-center">
                                                <Pencil size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
      </div>

       {/* Footer */}
       <div className="border-t border-slate-200 p-4 bg-white flex justify-between sticky bottom-0 z-20">
             <button onClick={onPrevious} className="text-slate-600 font-bold py-2 px-8 hover:bg-slate-50 rounded-full transition-colors text-sm">
                Previous
            </button>
             <button onClick={onNext} className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
    </div>
  );
};

export default RetirementExpenses;