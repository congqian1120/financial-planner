import React from 'react';
import { Info } from 'lucide-react';
import { PROJECTION_DATA } from '../constants';
import { ProjectionType } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

interface SummaryFooterProps {
  projectionType: ProjectionType;
}

const SummaryFooter: React.FC<SummaryFooterProps> = ({ projectionType = ProjectionType.ASSET_PROJECTION }) => {
  const finalData = PROJECTION_DATA[PROJECTION_DATA.length - 1];

  if (projectionType === ProjectionType.MONTHLY_CASH_FLOW || projectionType === ProjectionType.YEARLY_CASH_FLOW) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-base font-semibold text-slate-700">Assets at end of plan</h2>
        <a href="#" className="text-sm text-blue-700 font-medium hover:underline">
          Learn more about the chart
        </a>
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
    </div>
  );
};

export default SummaryFooter;