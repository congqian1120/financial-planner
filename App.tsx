import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnalysisPage from './components/AnalysisPage';
import HouseholdProfile from './components/HouseholdProfile';

const App: React.FC = () => {
  // Default to 0 (Household Profile) to match the prompt request, 
  // or 5 (Analysis) if we wanted to show the chart first. 
  // Since the user asked for the Household Profile page, I'll start there.
  const [currentStep, setCurrentStep] = useState<number>(0);

  const renderContent = () => {
    if (currentStep === 5) { // 'Your retirement analysis' is at index 5
      return <AnalysisPage />;
    }
    
    if (currentStep === 0) { // 'Household profile' is at index 0
      return <HouseholdProfile />;
    }

    // Fallback for other steps (rendering Household Profile generic view or Analysis as default)
    // For this demo, we'll keep Household Profile active for steps 0-4 to avoid empty pages,
    // as we haven't designed the other forms yet.
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