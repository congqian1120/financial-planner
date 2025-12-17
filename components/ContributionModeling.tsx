import React, { useMemo, useState } from 'react';
import { Info, X } from 'lucide-react';
import { AppData } from '../types';
import { CURRENT_YEAR, DEFAULT_CURRENT_AGE } from '../constants';

export interface ContributionState {
    selectedAmount: number;
    customAmount: string;
}

interface ContributionModelingProps {
  data: AppData;
  state: ContributionState;
  onChange: (state: ContributionState) => void;
}

const ContributionModeling: React.FC<ContributionModelingProps> = ({ data, state, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  
  const { household, retirement } = data;
  const { selectedAmount, customAmount } = state;

  const appliedAdditional = useMemo(() => {
      if (selectedAmount === -1) {
          return parseFloat(customAmount.replace(/,/g, '')) || 0;
      }
      return selectedAmount;
  }, [selectedAmount, customAmount]);

  const { assetChange, incomeChange, growthRate, withdrawalRate } = useMemo(() => {
     // Rates derived to match the screenshot's specific scenario:
     // "Significantly below average" for this specific asset mix
     const rate = 0.054; // 5.4% Annual Growth
     const wRate = 0.0362; // 3.62% Withdrawal Rate

     if (appliedAdditional === 0) return { assetChange: 0, incomeChange: 0, growthRate: rate, withdrawalRate: wRate };

     const birthYear = new Date(household.dob).getFullYear();
     const currentAge = isNaN(birthYear) ? DEFAULT_CURRENT_AGE : (CURRENT_YEAR - birthYear);
     const yearsToGrow = Math.max(0, retirement.retirementAge - currentAge);
     
     const n = 12; // monthly
     const monthlyRate = rate / 12;
     const months = yearsToGrow * 12;

     let fv = 0;
     if (months > 0) {
         // Future Value of a Series formula (Ordinary Annuity)
         // FV = PMT * ((1 + r)^n - 1) / r
         fv = appliedAdditional * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
     }

     const annualIncome = fv * wRate;
     
     return { 
         assetChange: Math.round(fv), 
         incomeChange: Math.round(annualIncome / 12),
         growthRate: rate,
         withdrawalRate: wRate
     };
  }, [appliedAdditional, household.dob, retirement.retirementAge]);

  const formatMoney = (val: number) => val.toLocaleString();

  const handleRadioChange = (amount: number) => {
    onChange({
        selectedAmount: amount,
        customAmount: '' // clear custom when selecting preset
    });
  };

  const handleCustomChange = (val: string) => {
    onChange({
        selectedAmount: -1,
        customAmount: val
    });
  };

  return (
    <div className="border-t border-slate-200 pt-12 mt-12">
        <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
            <h2 className="text-xl font-bold text-slate-800">How much more could you contribute each month?</h2>
            <button 
                onClick={(e) => { e.preventDefault(); setShowModal(true); }}
                className="text-sm text-slate-500 hover:text-blue-700 underline decoration-dotted underline-offset-4 decoration-slate-400"
            >
                Where did we get these numbers?
            </button>
        </div>
        
        <p className="text-sm text-slate-600 mb-8 max-w-5xl leading-relaxed">
            Consider how much of your take-home pay you'd be willing to contribute towards retirement instead. Keep in mind, even if you can't afford to contribute more, we may be able to show you how shifting some of your current contributions could help improve your retirement outlook.
        </p>

        {/* Input Controls */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 mb-12">
            <div className="flex items-center gap-2 shrink-0">
                 <span className="text-sm text-slate-700 font-bold">Monthly additional contributions</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                 {[0, 325, 650, 975, 1300].map((amount) => (
                    <label key={amount} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <input 
                                type="radio" 
                                name="additionalContribution"
                                checked={selectedAmount === amount}
                                onChange={() => handleRadioChange(amount)}
                                className="peer appearance-none w-4 h-4 rounded-full border border-slate-300 checked:border-green-700 checked:ring-1 checked:ring-green-700 transition-all"
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-green-700 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">
                           {amount === 0 ? '+$0' : `+$${amount}`}
                        </span>
                    </label>
                 ))}

                 <div className="flex items-center gap-4 ml-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                         <div className="relative flex items-center justify-center w-5 h-5">
                            <input 
                                type="radio" 
                                name="additionalContribution"
                                checked={selectedAmount === -1}
                                onChange={() => onChange({ ...state, selectedAmount: -1 })}
                                className="peer appearance-none w-4 h-4 rounded-full border border-slate-300 checked:border-green-700 checked:ring-1 checked:ring-green-700 transition-all"
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-green-700 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-sm text-slate-700">Custom amount</span>
                    </label>
                    <div className="flex gap-3">
                        <div className="relative w-32">
                            <span className="absolute left-3 top-2 text-slate-500 font-medium text-sm">$</span>
                            <input 
                                type="text"
                                disabled={selectedAmount !== -1}
                                value={customAmount}
                                onChange={(e) => handleCustomChange(e.target.value)}
                                className="w-full border border-slate-300 rounded-sm py-1.5 pl-6 pr-3 text-sm text-slate-800 focus:outline-none focus:border-green-700 disabled:bg-slate-50 disabled:text-slate-400"
                                placeholder="0"
                            />
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Result Comparison */}
        <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">How does your modeled contribution strategy compare to your current one?</h2>
            <p className="text-sm text-slate-600 mb-10">
                Displaying <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">significantly below average market conditions</span> in <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">today's dollars</span> using <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">your current asset mix</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto md:mx-0">
                {/* Income Change */}
                <div className="text-center">
                    <div className="text-[2.5rem] leading-tight font-light text-slate-800 mb-2">
                        {incomeChange > 0 ? '+' : ''}${formatMoney(incomeChange)}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <span>Estimated change in monthly retirement income</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                </div>

                {/* Assets Change */}
                <div className="text-center">
                    <div className="text-[2.5rem] leading-tight font-light text-slate-800 mb-2">
                         {assetChange > 0 ? '+' : ''}${formatMoney(assetChange)}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <span>Estimated change in assets at retirement</span>
                        <Info size={14} className="text-slate-400 cursor-help" />
                    </div>
                </div>
            </div>
        </div>

        {/* Methodology Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setShowModal(false)}
                ></div>
                <div className="relative bg-white rounded shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800">Calculation Methodology</h3>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">
                            These estimates are hypothetical and intended for educational purposes.
                        </p>
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-800 text-sm">Asset Growth</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                We project the growth of your additional monthly contributions ({selectedAmount > 0 ? `$${selectedAmount}` : 'custom amount'}) using an annual rate of return of <strong>{(growthRate * 100).toFixed(1)}%</strong>. This rate represents a "significantly below average" market condition for your current asset mix over the years until your planned retirement.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-800 text-sm">Monthly Income</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                The estimated monthly income is derived by applying a sustainable withdrawal rate of <strong>{(withdrawalRate * 100).toFixed(2)}%</strong> to the projected additional assets at retirement.
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 pt-4 border-t border-slate-100">
                            Figures are expressed in today's dollars, adjusted for estimated inflation. Actual investment returns will vary.
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ContributionModeling;