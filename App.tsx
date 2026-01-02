import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import { HouseholdProfile } from './components/HouseholdProfile';
import RetirementProfile from './components/RetirementProfile';
import RetirementExpenses from './components/RetirementExpenses';
import AccountsPage from './components/AccountsPage';
import RetirementIncome from './components/RetirementIncome';
import { AppData, Account } from './types';

const INITIAL_ACCOUNTS: Account[] = [
  { 
    id: 1, 
    name: "ROTH IRA", 
    number: "XXXX9977", 
    goal: "RETIREMENT", 
    type: "ROTH IRA\nSelf-Directed", 
    owner: "RICH", 
    value: 59284.43, 
    contributions: 2400 
  },
  { 
    id: 2, 
    name: "INDIVIDUAL - TOD", 
    number: "XXXX7621", 
    goal: "RETIREMENT", 
    type: "INDIVIDUAL - TOD\nFidelity Go", 
    owner: "RICH", 
    value: 75.10, 
    contributions: 0 
  },
  { 
    id: 3, 
    name: "401K RETIREMENT SAVINGS PLAN", 
    number: "XXXX3321", 
    goal: "RETIREMENT", 
    type: "401K RETIREMENT SAVINGS PLAN", 
    owner: "RICH", 
    value: 441757.88, 
    contributions: 20500 
  },
  { 
    id: 4, 
    name: "401K SAVINGS PLAN", 
    number: "XXXX8822", 
    goal: "RETIREMENT", 
    type: "401K RETIREMENT SAVINGS PLAN", 
    owner: "MONEY", // Partner account
    value: 312450.00, 
    contributions: 15000 
  },
  { 
    id: 5, 
    name: "INDIVIDUAL - TOD", 
    number: "XXXX0562", 
    goal: "RETIREMENT", 
    type: "INDIVIDUAL - TOD\nSelf-Directed", 
    owner: "RICH", 
    value: 485742.99, 
    contributions: 0 
  },
  { 
    id: 6, 
    name: "HEALTH SAVINGS ACCOUNT", 
    number: "XXXX8430", 
    goal: "RETIREMENT", 
    type: "HEALTH SAVINGS ACCOUNT\nSelf-Directed", 
    owner: "RICH", 
    value: 4551.10, 
    contributions: 3500 
  },
  { 
    id: 7, 
    name: "ROTH IRA", 
    number: "XXXX1122", 
    goal: "RETIREMENT", 
    type: "ROTH IRA\nSelf-Directed", 
    owner: "MONEY", // Partner account
    value: 42100.00, 
    contributions: 6000 
  },
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [data, setData] = useState<AppData>({
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
  });

  const updateData = (updates: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return <HouseholdProfile data={data} updateData={updateData} onNext={nextStep} />;
    }

    if (currentStep === 1) {
      return <RetirementProfile data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 2) {
      return <RetirementExpenses data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 3) {
      return <AccountsPage data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 4) {
      return <RetirementIncome data={data} updateData={updateData} onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 5) {
      return <AnalysisPage data={data} updateData={updateData} onNavigate={setCurrentStep} />;
    }
    
    return <HouseholdProfile data={data} updateData={updateData} onNext={nextStep} />;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex">
      <Sidebar activeStep={currentStep} onStepChange={setCurrentStep} />
      <div className="flex-1 min-w-0 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;