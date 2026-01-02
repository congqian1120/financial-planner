import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import { HouseholdProfile } from './components/HouseholdProfile';
import RetirementProfile from './components/RetirementProfile';
import RetirementExpenses from './components/RetirementExpenses';
import AccountsPage from './components/AccountsPage';
import RetirementIncome from './components/RetirementIncome';
import { AppData, Account } from './types';
import { Menu, X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'retirement_planner_data';

const INITIAL_ACCOUNTS: Account[] = [
  { 
    id: 1, 
    name: "ROTH IRA", 
    number: "XXXX9977", 
    goal: "RETIREMENT", 
    type: "ROTH IRA\nSelf-Directed", 
    owner: "RICH", 
    value: 59284.43, 
    contributions: 2400,
    assetBreakdown: { domestic: 98.87, foreign: 1.01, bonds: 0, shortTerm: 0.12, other: 0 }
  },
  { 
    id: 2, 
    name: "INDIVIDUAL - TOD", 
    number: "XXXX7621", 
    goal: "RETIREMENT", 
    type: "INDIVIDUAL - TOD\nFidelity Go", 
    owner: "RICH", 
    value: 75.10, 
    contributions: 0,
    assetBreakdown: { domestic: 13.8, foreign: 5.89, bonds: 74.53, shortTerm: 5.77, other: 0.01 }
  },
  { 
    id: 3, 
    name: "401K RETIREMENT SAVINGS PLAN", 
    number: "XXXX3321", 
    goal: "RETIREMENT", 
    type: "401K RETIREMENT SAVINGS PLAN", 
    owner: "RICH", 
    value: 441757.88, 
    contributions: 20500,
    assetBreakdown: { domestic: 58.11, foreign: 26.66, bonds: 14.29, shortTerm: 0.88, other: 0.07 }
  },
  { 
    id: 4, 
    name: "401K SAVINGS PLAN", 
    number: "XXXX8822", 
    goal: "RETIREMENT", 
    type: "401K RETIREMENT SAVINGS PLAN", 
    owner: "MONEY",
    value: 312450.00, 
    contributions: 15000,
    assetBreakdown: { domestic: 65.00, foreign: 25.00, bonds: 10.00, shortTerm: 0, other: 0 }
  },
  { 
    id: 5, 
    name: "INDIVIDUAL - TOD", 
    number: "XXXX0562", 
    goal: "RETIREMENT", 
    type: "INDIVIDUAL - TOD\nSelf-Directed", 
    owner: "RICH", 
    value: 485742.99, 
    contributions: 0,
    assetBreakdown: { domestic: 91.25, foreign: 8.7, bonds: 0, shortTerm: 0.05, other: 0 }
  },
  { 
    id: 6, 
    name: "HEALTH SAVINGS ACCOUNT", 
    number: "XXXX8430", 
    goal: "RETIREMENT", 
    type: "HEALTH SAVINGS ACCOUNT\nSelf-Directed", 
    owner: "RICH", 
    value: 4551.10, 
    contributions: 3500,
    assetBreakdown: { domestic: 13.97, foreign: 5.11, bonds: 74.16, shortTerm: 6.75, other: 0.01 }
  },
  { 
    id: 7, 
    name: "ROTH IRA", 
    number: "XXXX1122", 
    goal: "RETIREMENT", 
    type: "ROTH IRA\nSelf-Directed", 
    owner: "MONEY",
    value: 42100.00, 
    contributions: 6000,
    assetBreakdown: { domestic: 95.00, foreign: 5.00, bonds: 0, shortTerm: 0, other: 0 }
  },
];

const DEFAULT_DATA: AppData = {
  household: {
    name: "RICH WISE",
    dob: "October 4, 1992",
    income: 136750,
    bonus: 21250,
    partnerName: "MONEY WISE",
    partnerDob: "January 1, 1994",
    partnerIncome: 72000,
    partnerBonus: 0,
    planningWithPartner: false, 
  },
  retirement: {
    retirementAge: 69,
    partnerRetirementAge: 67,
    planToAge: 97,
    state: "North Carolina",
  },
  expenses: {
    method: 'monthly',
    lifestyle: 'average',
    essential: 10666,
    nonEssential: 2666,
    detailed: {
      'Housing & mortgage': 0,
      'Utilities': 0,
      'Health care & insurance': 0,
      'Transportation': 0,
      'Personal': 0,
      'Recreation': 0,
      'Entertainment': 0,
      'Custom expenses': 0,
      'Family care': 0,
    },
  },
  accounts: INITIAL_ACCOUNTS,
  income: {
    socialSecurity: {
      amount: 3750, 
      startAge: 67,
      enabled: true,
    },
    pension: 0,
    annuity: 0,
    other: 0,
    oneTime: 0,
  },
  modeledStrategy: null
};

const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Uncaught error:", error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded shadow-lg max-w-md text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Something went wrong</h2>
          <p className="text-slate-600 mb-6">The application encountered an unexpected error. Your progress has been saved.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-700 text-white px-6 py-2 rounded-full font-bold"
          >
            Reload Planner
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const STEP_NAMES = [
  'Household profile',
  'Retirement profile',
  'Retirement expenses',
  'Accounts',
  'Retirement income',
  'Your retirement analysis'
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DATA;
      }
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const navigateToStep = (step: number) => {
    setCurrentStep(step);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0: return <HouseholdProfile data={data} updateData={updateData} onNext={nextStep} />;
      case 1: return <RetirementProfile data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
      case 2: return <RetirementExpenses data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
      case 3: return <AccountsPage data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
      case 4: return <RetirementIncome data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
      case 5: return <AnalysisPage data={data} updateData={updateData} onNavigate={setCurrentStep} />;
      default: return <HouseholdProfile data={data} updateData={updateData} onNext={nextStep} />;
    }
  };

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <Sidebar activeStep={currentStep} onStepChange={navigateToStep} />

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {currentStep + 1} of 6</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
              {STEP_NAMES[currentStep]}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Menu size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-slate-800">Plan Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
               <Sidebar activeStep={currentStep} onStepChange={navigateToStep} isMobile />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          {renderContent()}
        </div>
      </div>
    </AppErrorBoundary>
  );
};

export default App;