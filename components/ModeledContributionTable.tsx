import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Breakdown {
  taxDeferred: number;
  taxable: number;
  taxExempt: number;
  hsa: number;
}

interface ModeledContributionTableProps {
  currentBreakdown: Breakdown;
  additionalContribution: number;
  onUpdatePlan: () => void;
}

const ModeledContributionTable: React.FC<ModeledContributionTableProps> = ({ 
  currentBreakdown, 
  additionalContribution,
  onUpdatePlan
}) => {
  const nextYear = new Date().getFullYear() + 1;

  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString()}`;

  const getMonthly = (annual: number) => annual / 12;

  // Monthly values
  const monthlyDeferred = getMonthly(currentBreakdown.taxDeferred);
  const monthlyTaxable = getMonthly(currentBreakdown.taxable);
  const monthlyExempt = getMonthly(currentBreakdown.taxExempt);
  const monthlyHsa = getMonthly(currentBreakdown.hsa);

  // In this simple model, we assume the additional contribution goes to Tax-Exempt
  // to show a change. The others remain constant (Keep contributing).
  // If additionalContribution is 0, all are "Keep contributing".

  const rows = [
    {
      type: 'Tax-deferred accounts',
      subtext: 'Pre-tax contributions',
      current: monthlyDeferred,
      change: 0,
      target: monthlyDeferred
    },
    {
      type: 'Taxable accounts',
      subtext: '',
      current: monthlyTaxable,
      change: 0,
      target: monthlyTaxable
    },
    {
      type: 'Tax-exempt accounts',
      subtext: '',
      current: monthlyExempt,
      change: additionalContribution,
      target: monthlyExempt + additionalContribution
    },
    {
      type: 'Health savings accounts',
      subtext: '',
      current: monthlyHsa,
      change: 0,
      target: monthlyHsa
    }
  ];

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Your modeled {nextYear} contribution strategy</h2>
      
      <div className="border border-slate-300 rounded-lg overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#e7e5e4] border-b border-slate-300">
              <th className="p-4 w-1/3 text-sm font-bold text-slate-800 border-r border-slate-300">Account type</th>
              <th className="p-4 w-2/3 text-sm font-bold text-slate-800">Summary of changes you modeled</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              const hasChange = row.change !== 0;
              const isIncrease = row.change > 0;
              
              return (
                <tr key={index} className={`bg-[#e9e8e6]/30 ${!isLast ? 'border-b border-slate-300' : ''}`}>
                  <td className="p-4 align-top border-r border-slate-300">
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-slate-700 underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help font-medium">
                        {row.type}
                      </span>
                      {row.subtext && (
                        <span className="text-xs text-slate-500 mt-1">{row.subtext}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    {hasChange ? (
                      <div className="text-sm text-slate-700 leading-relaxed">
                        <span className="font-bold">{isIncrease ? 'Increase' : 'Decrease'}</span> contributions by <span className="font-bold">{formatMoney(Math.abs(row.change))}</span>, for a total of {formatMoney(row.target)} monthly spread across your eligible accounts.
                      </div>
                    ) : (
                      <div className="text-sm text-slate-700">
                        Keep contributing <span className="font-normal">{formatMoney(row.current)}</span>, monthly.
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pb-8">
        <button 
          onClick={onUpdatePlan}
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          Update my plan
        </button>
      </div>
    </div>
  );
};

export default ModeledContributionTable;