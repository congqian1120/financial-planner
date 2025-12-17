import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AppData } from '../types';

interface HouseholdProfileProps {
  data: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onNext?: () => void;
}

export const HouseholdProfile: React.FC<HouseholdProfileProps> = ({ data, updateData, onNext }) => {
  const [isBonusExpanded, setIsBonusExpanded] = useState(true);
  
  // Local edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [isEditingPartnerName, setIsEditingPartnerName] = useState(false);
  const [isEditingPartnerDob, setIsEditingPartnerDob] = useState(false);

  const { household } = data;

  const updateHousehold = (updates: Partial<typeof household>) => {
    updateData({ household: { ...household, ...updates } });
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-white">
        <div className="p-8 max-w-4xl animate-in fade-in duration-500 flex-1 pb-24">
        <div className="mb-8">
            <div className="text-sm text-slate-500 mb-4">Navigation</div>
            <h1 className="text-3xl font-normal text-slate-800 mb-10">Household profile</h1>
            
            <h2 className="text-xl font-medium text-slate-800 mb-6">Personal information</h2>
            
            <div className="space-y-8 max-w-lg">
                {/* Name */}
                <div>
                    <div className="flex items-baseline gap-3 mb-1">
                        <label className="text-sm font-bold text-slate-800">Name</label>
                        <button 
                            onClick={() => setIsEditingName(!isEditingName)}
                            className="text-sm text-slate-500 underline decoration-dotted underline-offset-2 hover:text-blue-700"
                        >
                            {isEditingName ? 'Done' : 'Edit'}
                        </button>
                    </div>
                    {isEditingName ? (
                        <input 
                            type="text" 
                            value={household.name} 
                            onChange={(e) => updateHousehold({ name: e.target.value })}
                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-3 text-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm uppercase"
                        />
                    ) : (
                        <div className="text-lg text-slate-700 uppercase tracking-wide">{household.name}</div>
                    )}
                </div>

                {/* DOB */}
                <div>
                    <div className="flex items-baseline gap-3 mb-1">
                        <label className="text-sm font-bold text-slate-800">Date of birth</label>
                        <button 
                            onClick={() => setIsEditingDob(!isEditingDob)}
                            className="text-sm text-slate-500 underline decoration-dotted underline-offset-2 hover:text-blue-700"
                        >
                            {isEditingDob ? 'Done' : 'Edit'}
                        </button>
                    </div>
                    {isEditingDob ? (
                        <input 
                            type="text" 
                            value={household.dob}
                            onChange={(e) => updateHousehold({ dob: e.target.value })}
                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-3 text-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                    ) : (
                        <>
                            <div className="text-lg text-slate-700">{household.dob}</div>
                            <div className="text-sm text-slate-500 mt-1">Age 33</div>
                        </>
                    )}
                </div>

                {/* Gender */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-slate-800">Gender</label>
                        <HelpCircle size={16} className="text-blue-700 fill-white" />
                    </div>
                    <div className="relative w-40">
                        <select className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2.5 px-3 pr-8 rounded-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Earned Income */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className="text-sm font-bold text-slate-800">Earned income</label>
                        <HelpCircle size={16} className="text-blue-700 fill-white" />
                    </div>
                    <div className="text-xs text-slate-500 mb-2">Your annual salary</div>
                    <div className="relative max-w-xs mb-4">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                            placeholder="0" 
                            value={household.income}
                            onChange={(e) => updateHousehold({ income: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    {/* Bonus Toggle */}
                    <button 
                        onClick={() => setIsBonusExpanded(!isBonusExpanded)}
                        className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-4 group"
                    >
                        {isBonusExpanded ? (
                            <ChevronDown size={20} className="text-slate-500 group-hover:text-slate-700" strokeWidth={1.5} />
                        ) : (
                            <ChevronUp size={20} className="text-slate-500 group-hover:text-slate-700" strokeWidth={1.5} />
                        )}
                        <span className="font-medium">Add bonus or commissions</span>
                    </button>

                    {/* Bonus Fields */}
                    {isBonusExpanded && (
                        <div className="pl-7 space-y-4 animate-in slide-in-from-top-2 duration-200">
                             <div>
                                <div className="text-xs font-bold text-slate-700 mb-1">Bonus <span className="font-normal text-slate-500">(optional)</span></div>
                                <div className="relative max-w-xs">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                                    <input 
                                        type="text" 
                                        className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                                        value={household.bonus}
                                        onChange={(e) => updateHousehold({ bonus: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                             </div>
                        </div>
                    )}
                </div>
                
                <div className="pt-8 border-t border-dotted border-slate-300"></div>

                {/* Household Planning */}
                <div>
                     <h2 className="text-xl font-medium text-slate-800 mb-4">Household planning</h2>
                     <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-bold text-slate-800">Are you planning with someone?</label>
                         <HelpCircle size={16} className="text-blue-700 fill-white" />
                    </div>
                     
                    {!household.planningWithPartner ? (
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={household.planningWithPartner}
                                onChange={(e) => updateHousehold({ planningWithPartner: e.target.checked })}
                                className="h-4 w-4 border-gray-300 rounded-sm text-green-700 focus:ring-green-700 accent-green-700" 
                            />
                            <span className="text-slate-700 group-hover:text-slate-900 text-sm">Yes, I'm planning with a partner</span>
                        </label>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                             <div className="mb-6">
                                <p className="text-sm text-slate-700 mb-4">Yes, I'm planning with a partner</p>
                                <button 
                                    onClick={() => updateHousehold({ planningWithPartner: false })}
                                    className="text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 py-2 px-6 rounded-full transition-colors"
                                >
                                    Remove partner
                                </button>
                             </div>

                             <div className="space-y-8 pl-1">
                                 {/* Partner's Name */}
                                <div>
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <label className="text-sm font-bold text-slate-800">Partner's name</label>
                                        <button 
                                            onClick={() => setIsEditingPartnerName(!isEditingPartnerName)}
                                            className="text-sm text-slate-500 underline decoration-dotted underline-offset-2 hover:text-blue-700"
                                        >
                                            {isEditingPartnerName ? 'Done' : 'Edit'}
                                        </button>
                                    </div>
                                    {isEditingPartnerName ? (
                                        <input 
                                            type="text" 
                                            value={household.partnerName}
                                            onChange={(e) => updateHousehold({ partnerName: e.target.value })}
                                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-3 text-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        />
                                    ) : (
                                        <div className="text-lg text-slate-700 tracking-wide uppercase">{household.partnerName}</div>
                                    )}
                                </div>

                                 {/* Partner's DOB */}
                                <div>
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <label className="text-sm font-bold text-slate-800">Partner's date of birth</label>
                                        <button 
                                            onClick={() => setIsEditingPartnerDob(!isEditingPartnerDob)}
                                            className="text-sm text-slate-500 underline decoration-dotted underline-offset-2 hover:text-blue-700"
                                        >
                                            {isEditingPartnerDob ? 'Done' : 'Edit'}
                                        </button>
                                    </div>
                                    {isEditingPartnerDob ? (
                                        <input 
                                            type="text" 
                                            value={household.partnerDob}
                                            onChange={(e) => updateHousehold({ partnerDob: e.target.value })}
                                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 px-3 text-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                        />
                                    ) : (
                                        <>
                                            <div className="text-lg text-slate-700">{household.partnerDob}</div>
                                            <div className="text-sm text-slate-500 mt-1">Age 31</div>
                                        </>
                                    )}
                                </div>

                                {/* Partner Income - Added for completeness */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <label className="text-sm font-bold text-slate-800">Partner's earned income</label>
                                        <HelpCircle size={16} className="text-blue-700 fill-white" />
                                    </div>
                                    <div className="relative max-w-xs mb-4">
                                        <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                                        <input 
                                            type="text" 
                                            className="w-full border border-slate-300 hover:border-slate-400 rounded-sm py-2 pl-6 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                                            placeholder="0" 
                                            value={household.partnerIncome}
                                            onChange={(e) => updateHousehold({ partnerIncome: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-white flex justify-end sticky bottom-0 z-20">
             <button onClick={onNext} className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2 px-8 rounded-full transition-colors shadow-sm text-sm">
                Next
            </button>
        </div>
    </div>
  );
};
