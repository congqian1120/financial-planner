import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ViewMode, ProjectionType } from '../types';

interface ControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  projectionType: ProjectionType;
  setProjectionType: (type: ProjectionType) => void;
  activeStrategyName?: string | null;
}

const Controls: React.FC<ControlsProps> = ({ 
  viewMode, 
  setViewMode, 
  projectionType, 
  setProjectionType,
  activeStrategyName
}) => {
  
  const renderDescription = () => {
    const todayDollarsSpan = <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">today's dollars</span>;
    
    // If we have a modeled strategy, show its name. Otherwise, clarify it is the current mix.
    const assetMixLabel = activeStrategyName 
      ? `the ${activeStrategyName.toLowerCase()} asset mix` 
      : "your current asset mix";
      
    const assetMixSpan = <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">{assetMixLabel}</span>;
    const marketSpan = <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">significantly below average market conditions</span>;

    if (projectionType === ProjectionType.MONTHLY_CASH_FLOW || projectionType === ProjectionType.YEARLY_CASH_FLOW) {
      return (
        <p className="text-sm text-slate-700">
          Displaying {marketSpan} in {todayDollarsSpan} using {assetMixSpan}.
        </p>
      );
    }
    return (
      <p className="text-sm text-slate-700">
        Displaying {todayDollarsSpan} from today until end of plan using {assetMixSpan}.
      </p>
    );
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        <label className="block text-base font-bold text-slate-800 mb-2">
          Select charts and tables
        </label>
        <div className="relative inline-block w-full sm:w-80">
          <select
            value={projectionType}
            onChange={(e) => setProjectionType(e.target.value as ProjectionType)}
            className="w-full appearance-none bg-white border border-slate-400 text-slate-700 py-2.5 px-5 pr-10 rounded-full leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer text-base overflow-ellipsis shadow-sm"
          >
            <option value={ProjectionType.ASSET_PROJECTION}>Asset projection</option>
            <option value={ProjectionType.MONTHLY_CASH_FLOW}>Monthly cash flow in retirement</option>
            <option value={ProjectionType.YEARLY_CASH_FLOW}>Yearly cash flow in retirement</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-800">
            <ChevronDown size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        {renderDescription()}
      </div>

      <div className="border-b border-slate-300 flex gap-8">
        <button
          onClick={() => setViewMode(ViewMode.CHART)}
          className={`pb-2 text-base font-semibold border-b-4 transition-colors ${
            viewMode === ViewMode.CHART
              ? 'border-green-700 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Chart
        </button>
        <button
          onClick={() => setViewMode(ViewMode.TABLE)}
          className={`pb-2 text-base font-semibold border-b-4 transition-colors ${
            viewMode === ViewMode.TABLE
              ? 'border-green-700 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Table
        </button>
      </div>
    </div>
  );
};

export default Controls;