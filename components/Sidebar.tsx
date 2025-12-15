import React from 'react';
import { Check, Info, FlaskConical } from 'lucide-react';

const steps = [
  { title: 'Household profile', type: 'step' },
  { title: 'Retirement profile', type: 'step' },
  { title: 'Retirement expenses', type: 'step' },
  { title: 'Accounts', type: 'step' },
  { title: 'Retirement income', type: 'step' },
  { title: 'Your retirement analysis', type: 'analysis' },
];

interface SidebarProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeStep, onStepChange }) => {
  return (
    <div className="w-72 bg-slate-50 border-r border-slate-200 hidden lg:flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="p-8 pb-4 shrink-0">
        <h2 className="text-2xl font-normal text-slate-800 mb-4 leading-tight">Your retirement goal</h2>
        <div className="flex gap-3 text-sm text-slate-600 mb-8 items-start">
           <Info className="shrink-0 w-4 h-4 text-green-700 mt-1 fill-green-100" /> 
           <p className="leading-snug">Complete your profile, to see where you may stand.</p>
        </div>
      </div>

      <div className="flex flex-col w-full pb-10">
        {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isAnalysis = step.type === 'analysis';
            
            // Check if there is a next step and if it is also a 'step' type to decide on drawing the line
            const hasNextStep = index < steps.length - 1;
            const nextIsStep = hasNextStep && steps[index + 1].type === 'step';
            const showLine = !isAnalysis && nextIsStep;
            
            return (
                <div 
                    key={index} 
                    className={`relative flex items-stretch cursor-pointer group transition-all duration-200 ${isActive ? 'bg-white shadow-sm' : 'hover:bg-slate-100'}`}
                    onClick={() => onStepChange(index)}
                >
                   
                   {/* Left Marker Column */}
                   <div className="w-20 relative flex justify-center shrink-0">
                      {/* Vertical connector line */}
                      {showLine && (
                          <div className="absolute top-8 bottom-[-20px] w-0.5 bg-slate-300 left-1/2 -translate-x-1/2"></div>
                      )}
                      
                      {/* Icon */}
                      {isAnalysis ? (
                        <div className={`mt-5 relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-200 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                           <FlaskConical className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                      ) : (
                        <div className={`mt-5 relative z-10 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-50 transition-colors duration-200 ${isActive ? 'bg-green-700 ring-white' : 'bg-green-700'}`}>
                           <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                   </div>

                   {/* Right Content Column */}
                   <div className="py-5 pr-6 flex-grow flex items-center">
                       <span className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                           {step.title}
                       </span>
                   </div>

                   {/* Active Indicator Bar */}
                   {isActive && (
                       <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-green-700"></div>
                   )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Sidebar;