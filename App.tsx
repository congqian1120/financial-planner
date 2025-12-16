import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import HouseholdProfile from './components/HouseholdProfile';
import RetirementProfile from './components/RetirementProfile';
import RetirementExpenses from './components/RetirementExpenses';

const App: React.FC = () => {
  // Default to 2 (Retirement Expenses) to show the new page requested
  const [currentStep, setCurrentStep] = useState<number>(2);

  const renderContent = () => {
    if (currentStep === 0) {
      return <HouseholdProfile />;
    }

    if (currentStep === 1) {
      return <RetirementProfile />;
    }

    if (currentStep === 2) {
      return <RetirementExpenses />;
    }

    if (currentStep === 5) { // 'Your retirement analysis' is at index 5
      return <AnalysisPage />;
    }
    
    // Fallback for other steps
    return <HouseholdProfile />;
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