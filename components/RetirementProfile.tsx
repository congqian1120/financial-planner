import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { AppData } from '../types';

interface RetirementProfileProps {
  data: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const RetirementProfile: React.FC<RetirementProfileProps> = ({ data, updateData, onNext, onPrevious }) => {
  const [goalName, setGoalName] = useState("Retirement");
  const [taxStatus, setTaxStatus] = useState("Single");
  
  const { retirement, household } = data;

  const updateRetirement = (updates: Partial<typeof retirement>) => {
    updateData({ retirement: { ...retirement, ...updates } });
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-white">
      <div className="p-8 max-w-4xl animate-in fade-in duration-500 flex-1 pb-24">
        <div className="mb-8">
            <div className="text-sm text-slate-500 mb-4">Navigation</div>
            <h1 className="text-3xl font-normal text-slate-800 mb-10">Retirement profile</h1>

            {/* Goal Details Section */}
            <div className="mb-10">
                <h2 className="text-xl font-medium text-slate-800 mb-6">Goal details</h2>
                
                <div className="space-y-6 max-w-lg">
                    {/* Goal Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Goal name</label>
                        <input 
                            type="text" 
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                    </div>

                    {/* Retirement Age */}
                    <div>
                        <div className="mb-2">
                             <label className="text-sm font-bold text-slate-800">At what age do you plan to retire?</label>
                        </div>
                         <div className="flex justify-between items-center gap-4">
                            <div className="text-sm text-slate-500">Retirement age for {household.name}</div>
                            <input 
                                type="text" 
                                value={retirement.retirementAge}
                                onChange={(e) => updateRetirement({ retirementAge: parseInt(e.target.value) || 0 })}
                                className="w-16 border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-2 text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                         </div>
                    </div>

                    {/* Partner Retirement Age (if exists) */}
                    {household.planningWithPartner && (
                        <div>
                             <div className="flex justify-between items-center gap-4 mt-2">
                                <div className="text-sm text-slate-500">Retirement age for {household.partnerName}</div>
                                <input 
                                    type="text" 
                                    value={retirement.partnerRetirementAge}
                                    onChange={(e) => updateRetirement({ partnerRetirementAge: parseInt(e.target.value) || 0 })}
                                    className="w-16 border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-2 text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                />
                             </div>
                        </div>
                    )}

                    {/* Plan-to Age */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <label className="text-sm font-bold text-slate-800">What age do you want to plan for your assets to last until?</label>
                             <HelpCircle size={16} className="text-blue-700 fill-white cursor-help" />
                        </div>
                         <div className="flex justify-between items-center gap-4">
                            <div className="text-sm text-slate-500">Plan-to age for {household.name}</div>
                            <input 
                                type="text" 
                                value={retirement.planToAge}
                                onChange={(e) => updateRetirement({ planToAge: parseInt(e.target.value) || 0 })}
                                className="w-16 border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-2 text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                         </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-dotted border-slate-300 mb-10"></div>

            {/* Taxes Section */}
            <div>
                 <h2 className="text-xl font-medium text-slate-800 mb-6">Taxes</h2>
                 <p className="text-sm text-slate-600 mb-6">
                    Or use your detailed tax rates. Sometimes we'll estimate using [Federal marginal tax bracket 24%] and [State tax bracket 5.25%]
                 </p>

                 <div className="space-y-6 max-w-lg">
                    {/* Tax Status */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm font-bold text-slate-800">What's your tax filing status?</label>
                            <HelpCircle size={16} className="text-blue-700 fill-white cursor-help" />
                        </div>
                        <div className="relative">
                            <select 
                                value={taxStatus}
                                onChange={(e) => setTaxStatus(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2.5 px-3 pr-8 rounded-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            >
                                <option>Single</option>
                                <option>Married filing jointly</option>
                                <option>Married filing separately</option>
                                <option>Head of household</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* State */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm font-bold text-slate-800">What state do you plan to live in during retirement?</label>
                        </div>
                        <div className="relative">
                            <select 
                                value={retirement.state}
                                onChange={(e) => updateRetirement({ state: e.target.value })}
                                className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2.5 px-3 pr-8 rounded-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            >
                                <option>North Carolina</option>
                                <option>California</option>
                                <option>New York</option>
                                <option>Texas</option>
                                <option>Florida</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
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

export default RetirementProfile;