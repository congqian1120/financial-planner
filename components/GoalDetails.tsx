
import React, { useState } from 'react';
import { Wallet, MapPin, Banknote, Info, CheckCircle2, BookOpen, User, PieChart, X, AlertCircle, ExternalLink, TrendingUp, FileText } from 'lucide-react';
import { AppData } from '../types';
import { calculateExpenses } from './RetirementExpenses';

interface GoalDetailsProps {
  data: AppData;
  onNavigate: (step: number) => void;
  onExploreSavings?: () => void;
  onViewAssetAllocation?: () => void;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ data, onNavigate, onExploreSavings, onViewAssetAllocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStrategiesModal, setShowStrategiesModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [notImplementedFeature, setNotImplementedFeature] = useState<string | null>(null);

  const { retirement, accounts, household, income } = data;

  // Derived Calculations
  const totalSaved = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.value, 0);
  const totalContributions = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.contributions, 0);
  const assignedAccountsCount = accounts.filter(a => a.goal === 'RETIREMENT').length;
  
  const expenses = calculateExpenses(data.expenses);

  const lifetimeIncome = income.socialSecurity.amount + income.pension + income.annuity;

  const handleNotMockedClick = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    setNotImplementedFeature(feature);
  };

  const handleExploreSavingsClick = () => {
    setShowStrategiesModal(false);
    if (onExploreSavings) {
      onExploreSavings();
    } else {
      setNotImplementedFeature("Retirement savings strategy");
    }
  };

  const handleViewAssetAllocation = () => {
    setShowInvestmentModal(false);
    if (onViewAssetAllocation) {
      onViewAssetAllocation();
    } else {
      setNotImplementedFeature("Asset allocation options");
    }
  };

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
               <button 
                onClick={() => setShowStrategiesModal(true)}
                className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm"
               >
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
               <button 
                onClick={() => setShowInvestmentModal(true)}
                className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm"
               >
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
               <button 
                onClick={() => setShowIncomeModal(true)}
                className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full shadow-sm"
               >
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

      {/* STRATEGIES MODAL (Retirement Savings) */}
      {showStrategiesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" onClick={() => setShowStrategiesModal(false)}></div>
            <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <button 
                  onClick={() => setShowStrategiesModal(false)} 
                  className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500 z-10"
              >
                  <X size={24} strokeWidth={1.5} />
              </button>
              
              <div className="p-8 md:p-10">
                  <div className="flex items-start gap-5 mb-8">
                    {/* Green Icon */}
                    <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shrink-0 mt-1">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-normal text-slate-800 mb-4">Explore changes that could improve your outlook</h2>
                        <h3 className="font-bold text-slate-800 text-sm mb-2">Could a different approach to saving help improve your retirement outlook?</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                          The amount you save today may have a significant impact on your ability to meet expenses in retirement. Explore how a new savings strategy could change your outlook.
                        </p>
                        <button 
                          onClick={handleExploreSavingsClick}
                          className="border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold py-2 px-6 rounded-full text-sm transition-colors"
                        >
                          Explore savings strategies
                        </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-white" />
                        </div>
                        <h2 className="text-xl font-normal text-slate-800">Consider updates to your plan</h2>
                    </div>

                    <div className="pl-12 space-y-8">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Learn about automatic contributions</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Setting up automatic investments from either an outside account or a Fidelity account can help you become a more consistent saver.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Automatic contributions')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              About automatic contributions <ExternalLink size={14} />
                          </a>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Manage your workplace contributions</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              View or update your existing contributions.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Workplace contributions')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              Manage workplace contributions <ExternalLink size={14} />
                          </a>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Consider opening an account</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Explore our different account options to see which ones might meet your needs
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Open an account')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              Open an account <ExternalLink size={14} />
                          </a>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Find out how to transfer assets</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              It's a simple way you could move money from an outside account to Fidelity.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Transfer assets')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              How to transfer assets <ExternalLink size={14} />
                          </a>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">See how direct deposit could simplify your finances</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Learn how to set up direct deposit with your payroll provider
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Direct deposit')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              How to set up direct deposit <ExternalLink size={14} />
                          </a>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
      )}

      {/* INVESTMENT MODAL (New) */}
      {showInvestmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" onClick={() => setShowInvestmentModal(false)}></div>
            <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <button 
                  onClick={() => setShowInvestmentModal(false)} 
                  className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500 z-10"
              >
                  <X size={24} strokeWidth={1.5} />
              </button>
              
              <div className="p-8 md:p-10">
                  <div className="flex items-start gap-5 mb-8">
                    {/* Green Icon */}
                    <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shrink-0 mt-1">
                        <PieChart size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-normal text-slate-800 mb-4">Explore changes that could improve your outlook</h2>
                        <h3 className="font-bold text-slate-800 text-sm mb-2">How could a different asset mix impact your plan?</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                          Before making adjustments to the way you're invested, you can use this tool to explore the potential impact of changes to your plan.
                        </p>
                        <button 
                            onClick={handleViewAssetAllocation}
                            className="border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold py-2 px-6 rounded-full text-sm transition-colors"
                        >
                          View options
                        </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-white" />
                        </div>
                        <h2 className="text-xl font-normal text-slate-800">Consider updates to your plan</h2>
                    </div>

                    <div className="pl-12 space-y-8">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Explore investment strategies</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Find out how you might invest toward your goals. If you choose to select a strategy, we can help you choose investments to bring it to life.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Investment strategies')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              Get started <ExternalLink size={14} />
                          </a>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
      )}

      {/* INCOME MODAL (New) */}
      {showIncomeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" onClick={() => setShowIncomeModal(false)}></div>
            <div className="relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <button 
                  onClick={() => setShowIncomeModal(false)} 
                  className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500 z-10"
              >
                  <X size={24} strokeWidth={1.5} />
              </button>
              
              <div className="p-8 md:p-10">
                  <div className="">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-white" />
                        </div>
                        <h2 className="text-xl font-normal text-slate-800">Consider updates to your plan</h2>
                    </div>

                    <div className="pl-12 space-y-8">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Learn about bond ladders</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Adding a bond ladder to your plan could help provide more consistent income in retirement while potentially helping you manage the risk of changing interest rates and stock market volatility.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Bond ladders')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              About bond ladders <ExternalLink size={14} />
                          </a>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">Explore annuities</h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-2">
                              Adding an annuity to your plan could help supplement your retirement income. A Fidelity advisor can show you how annuities might fit into your plan.
                          </p>
                          <a href="#" onClick={(e) => handleNotMockedClick(e, 'Annuities')} className="text-blue-700 text-sm hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">
                              About annuities <ExternalLink size={14} />
                          </a>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
      )}

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

      {/* NOT IMPLEMENTED MODAL */}
      {notImplementedFeature && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setNotImplementedFeature(null)}></div>
            <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center border border-slate-200">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-500">
                    <AlertCircle size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Page Not Mocked</h3>
                 <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    The <span className="font-semibold">"{notImplementedFeature}"</span> page is not available in this demo version.
                 </p>
                 <button 
                    onClick={() => setNotImplementedFeature(null)}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors w-full"
                 >
                    Go Back
                 </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default GoalDetails;
