import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Breakdown {
  taxDeferred: number;
  taxable: number;
  taxExempt: number;
  hsa: number;
}

interface ModeledContributionStrategyProps {
  currentBreakdown: Breakdown;
  additionalContribution: number;
}

const ModeledContributionStrategy: React.FC<ModeledContributionStrategyProps> = ({ 
  currentBreakdown, 
  additionalContribution 
}) => {
  const [view, setView] = useState('chart');

  // Colors matching the previous sections
  const COLORS = {
    taxDeferred: '#65a30d', // Green
    taxable: '#0ea5e9',     // Blue
    taxExempt: '#eab308',   // Yellow
    hsa: '#9333ea',         // Purple
  };

  const getMonthly = (val: number) => val / 12;

  const currentMonthlyBreakdown = {
      taxDeferred: getMonthly(currentBreakdown.taxDeferred),
      taxable: getMonthly(currentBreakdown.taxable),
      taxExempt: getMonthly(currentBreakdown.taxExempt),
      hsa: getMonthly(currentBreakdown.hsa),
  };
  const currentMonthlyTotal = Object.values(currentMonthlyBreakdown).reduce((a, b) => a + b, 0);

  // Assumption: Additional contribution goes to Tax-Exempt (Yellow) for modeling visualization
  // This matches the screenshot where a yellow bar appears/grows in the modeled strategy
  const modeledMonthlyBreakdown = {
      ...currentMonthlyBreakdown,
      taxExempt: currentMonthlyBreakdown.taxExempt + additionalContribution
  };
  const modeledMonthlyTotal = currentMonthlyTotal + additionalContribution;

  // Max value for scaling
  const maxValue = Math.max(currentMonthlyTotal, modeledMonthlyTotal) * 1.15; // 15% buffer

  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString()}`;

  const renderBar = (data: typeof currentMonthlyBreakdown, total: number) => {
      // Calculate widths
      const wDeferred = (data.taxDeferred / maxValue) * 100;
      const wTaxable = (data.taxable / maxValue) * 100;
      const wExempt = (data.taxExempt / maxValue) * 100;
      const wHsa = (data.hsa / maxValue) * 100;

      return (
          <div className="flex items-center h-10 bg-slate-100 rounded-sm overflow-hidden relative">
              {data.taxDeferred > 0 && <div style={{ width: `${wDeferred}%`, backgroundColor: COLORS.taxDeferred }} className="h-full"></div>}
              {data.taxable > 0 && <div style={{ width: `${wTaxable}%`, backgroundColor: COLORS.taxable }} className="h-full"></div>}
              {data.hsa > 0 && <div style={{ width: `${wHsa}%`, backgroundColor: COLORS.hsa }} className="h-full"></div>}
              {data.taxExempt > 0 && <div style={{ width: `${wExempt}%`, backgroundColor: COLORS.taxExempt }} className="h-full"></div>}
              
              {/* Label at the end */}
              <div className="absolute ml-2 text-sm font-bold text-slate-700" style={{ left: `${(total/maxValue)*100}%` }}>
                 {formatMoney(total)}/mo
              </div>
          </div>
      );
  };

  return (
    <div className="border-t border-slate-200 pt-12 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-xl font-bold text-slate-800 mb-2">What your modeled contribution strategy could look like</h2>
        <p className="text-sm text-slate-600 mb-8 max-w-4xl leading-relaxed">
            Here's how you might spread your contributions across account types, beginning in the next full calendar year, to achieve the outcomes shown above.
        </p>

        {/* Controls */}
        <div className="mb-8">
             <label className="block text-sm font-bold text-slate-700 mb-2">Select charts and tables</label>
             <div className="relative inline-block w-64 mb-6">
                <select className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2 px-3 pr-8 rounded-sm leading-tight focus:outline-none shadow-sm cursor-pointer text-sm font-medium">
                    <option>Single year comparison</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                    <ChevronDown size={16} />
                </div>
            </div>

            <div className="flex gap-8 border-b border-slate-200">
                <button 
                    onClick={() => setView('chart')}
                    className={`pb-2 text-sm font-bold border-b-4 transition-colors ${view === 'chart' ? 'border-green-700 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Chart
                </button>
                 <button 
                    onClick={() => setView('table')}
                    className={`pb-2 text-sm font-bold border-b-4 transition-colors ${view === 'table' ? 'border-green-700 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Table
                </button>
            </div>
        </div>

        {view === 'chart' ? (
            <div className="bg-slate-50 p-6 md:p-8 rounded-sm border border-slate-200/60">
                <h3 className="text-sm font-bold text-slate-800 mb-8">Comparing your modeled and current monthly contribution strategy for {new Date().getFullYear() + 1}</h3>
                
                <div className="space-y-10 mb-8">
                    <div>
                        <div className="text-sm text-slate-600 mb-2">Current contribution strategy</div>
                        {renderBar(currentMonthlyBreakdown, currentMonthlyTotal)}
                    </div>
                    <div>
                        <div className="text-sm text-slate-600 mb-2">Modeled contribution strategy</div>
                        {renderBar(modeledMonthlyBreakdown, modeledMonthlyTotal)}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#65a30d]"></div>
                        <span className="text-xs text-slate-600">Tax-deferred accounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#0ea5e9]"></div>
                        <span className="text-xs text-slate-600">Taxable accounts</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#9333ea]"></div>
                        <span className="text-xs text-slate-600">Health savings accounts</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#eab308]"></div>
                        <span className="text-xs text-slate-600">Tax-exempt accounts</span>
                    </div>
                </div>
            </div>
        ) : (
            <div className="border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-3 font-bold text-slate-700">Account Type</th>
                            <th className="p-3 font-bold text-slate-700 text-right">Current (Monthly)</th>
                            <th className="p-3 font-bold text-slate-700 text-right">Modeled (Monthly)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-3 text-slate-600">Tax-deferred</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(currentMonthlyBreakdown.taxDeferred)}</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(modeledMonthlyBreakdown.taxDeferred)}</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-slate-600">Taxable</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(currentMonthlyBreakdown.taxable)}</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(modeledMonthlyBreakdown.taxable)}</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-slate-600">Tax-exempt</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(currentMonthlyBreakdown.taxExempt)}</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(modeledMonthlyBreakdown.taxExempt)}</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-slate-600">HSA</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(currentMonthlyBreakdown.hsa)}</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(modeledMonthlyBreakdown.hsa)}</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                            <td className="p-3 text-slate-800">Total</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(currentMonthlyTotal)}</td>
                            <td className="p-3 text-right text-slate-800">{formatMoney(modeledMonthlyTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default ModeledContributionStrategy;