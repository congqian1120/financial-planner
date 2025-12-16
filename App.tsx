import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import HouseholdProfile from './components/HouseholdProfile';
import RetirementProfile from './components/RetirementProfile';
import RetirementExpenses from './components/RetirementExpenses';

const App: React.FC = () => {
  // Default to 2 (Retirement Expenses) as per previous state
  const [currentStep, setCurrentStep] = useState<number>(2);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return <HouseholdProfile onNext={nextStep} />;
    }

    if (currentStep === 1) {
      return <RetirementProfile onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 2) {
      return <RetirementExpenses onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 3) {
      return (
        <div className="p-8 max-w-4xl animate-in fade-in duration-500">
           <h1 className="text-3xl font-normal text-slate-800 mb-10">Accounts</h1>
           <p className="text-slate-600 mb-8">Account configuration is under construction.</p>
           <div className="border-t border-slate-200 p-4 bg-white flex justify-between mt-auto">
             <button onClick={prevStep} className="text-slate-600 font-bold py-2 px-8 hover:bg-slate-50 rounded-full transition-colors text-sm">
                Previous
            </button>
             <button onClick={nextStep} className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="p-8 max-w-4xl animate-in fade-in duration-500">
           <h1 className="text-3xl font-normal text-slate-800 mb-10">Retirement income</h1>
           <p className="text-slate-600 mb-8">Retirement income configuration is under construction.</p>
           <div className="border-t border-slate-200 p-4 bg-white flex justify-between mt-auto">
             <button onClick={prevStep} className="text-slate-600 font-bold py-2 px-8 hover:bg-slate-50 rounded-full transition-colors text-sm">
                Previous
            </button>
             <button onClick={nextStep} className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
        </div>
      );
    }

    if (currentStep === 5) { // 'Your retirement analysis' is at index 5
      return <AnalysisPage />;
    }
    
    // Fallback
    return <HouseholdProfile onNext={nextStep} />;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex">
      <Sidebar activeStep={currentStep} onStepChange={setCurrentStep} />
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;