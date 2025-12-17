import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import HouseholdProfile from './components/HouseholdProfile';
import RetirementProfile from './components/RetirementProfile';
import RetirementExpenses from './components/RetirementExpenses';
import AccountsPage from './components/AccountsPage';
import RetirementIncome from './components/RetirementIncome';

const App: React.FC = () => {
  // Default to 4 (Retirement Income) to show the new page
  const [currentStep, setCurrentStep] = useState<number>(4);

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
      return <AccountsPage onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 4) {
      return <RetirementIncome onNext={nextStep} onPrevious={prevStep} />;
    }

    if (currentStep === 5) { // 'Your retirement analysis' is at index 5
      return <AnalysisPage onNavigate={setCurrentStep} />;
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