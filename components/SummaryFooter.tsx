import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { ProjectionType, ProjectionData } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

interface SummaryFooterProps {
  projectionType: ProjectionType;
  projectionData: ProjectionData[];
}

const SummaryFooter: React.FC<SummaryFooterProps> = ({ 
  projectionType = ProjectionType.ASSET_PROJECTION,
  projectionData 
}) => {
  const [showModal, setShowModal] = useState(false);
  
  // Guard against empty data
  if (!projectionData || projectionData.length === 0) return null;

  const finalData = projectionData[projectionData.length - 1];

  if (projectionType === ProjectionType.MONTHLY_CASH_FLOW || projectionType === ProjectionType.YEARLY_CASH_FLOW) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-base font-semibold text-slate-700">Assets at end of plan</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-700 font-medium hover:underline focus:outline-none"
        >
          Learn more about the chart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="text-center md:text-left">
           <div className="text-3xl text-slate-700 font-normal mb-2">
             {formatCurrency(finalData.significantlyBelowAverage)}
           </div>
           <div className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-sm">
             <span>Significantly below average market</span>
             <Info size={14} className="fill-blue-800 text-white cursor-help" />
           </div>
        </div>

        {/* Card 2 */}
        <div className="text-center md:text-left">
           <div className="text-3xl text-slate-700 font-normal mb-2">
             {formatCurrency(finalData.belowAverage)}
           </div>
           <div className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-sm">
             <span>Below average market</span>
             <Info size={14} className="fill-blue-800 text-white cursor-help" />
           </div>
        </div>

        {/* Card 3 */}
        <div className="text-center md:text-left">
           <div className="text-3xl text-slate-700 font-normal mb-2">
             {formatCurrency(finalData.average)}
           </div>
           <div className="flex items-center justify-center md:justify-start gap-1 text-slate-500 text-sm">
             <span>Average market</span>
             <Info size={14} className="fill-blue-800 text-white cursor-help" />
           </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">Our Assumptions and Methodology</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <section>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  The primary objective of the investment analysis tool (the "tool") is to help provide education on how current savings and estimated future contributions may help to satisfy a future savings goal for your account. Using inputs you provide, we gather general information about a hypothetical scenario and roughly estimate how that scenario may perform over time. The estimated results offered by the tool are not intended to be investment advice or recommendations, and you should not rely on the tool as the primary basis for your saving or investment decisions. The tool is not a substitute for a more detailed plan.
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  The tool's results regarding the hypothetical accumulation of assets are derived from Monte Carlo simulations based on historical market data taking into consideration the range of balance outcomes a portfolio might experience under different market conditions, although the market's past performance does not predict how it will perform in the future.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-800 mb-2">Limitations of the tool</h4>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  It is important to remember that the tool is not intended to project or predict the present or future value of an actual asset allocation, actual investments, or actual holdings in your account. Also, the tool should not be used as the primary basis for any investment, savings or tax-planning decisions. This tool makes no assumptions about taxes and displays all results in gross (before tax) format.
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  All calculations and results generated by the tool are generated through Monte Carlo simulations based on an analysis of historical market data. The analysis considers the probabilities of returns that certain asset mixes might experience under different market conditions. The tool assumes a level of diversity within each asset class consistent with a specific market index. Asset classes are represented by benchmark return data from Morningstar, Inc., not actual investments.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-800 mb-2">How calculations work</h4>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  This tool uses data from a modeling engine which estimates the likelihood of a particular outcome based on an analysis of historical market data. The rounded estimates are expressed in nominal terms (not adjusted for inflation) and are determined by running data through 100,000 pre-generated hypothetical market simulations. Results are estimated at multiple confidence levels.
                </p>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  The asset projection is based on four data items derived from information provided by you:
                </p>
                <ul className="list-disc pl-5 text-slate-700 text-sm leading-relaxed space-y-1 mb-4">
                  <li>Initial balance</li>
                  <li>Monthly savings amount assumed to be invested at the end of each period</li>
                  <li>Asset allocation (chosen from among the available set of Investment Strategies)</li>
                  <li>Investment time horizon (how long before you will need your money)</li>
                </ul>
                <p className="text-slate-700 text-sm font-semibold">
                  IMPORTANT: The hypothetical asset projections do not factor in withdrawals from your Account.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryFooter;