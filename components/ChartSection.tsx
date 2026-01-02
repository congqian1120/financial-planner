import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Info, X } from 'lucide-react';
import { ProjectionData, CashFlowData, ProjectionType } from '../types';
import { CHART_COLORS, CURRENT_YEAR } from '../constants';

const CustomReferenceLabel = (props: any) => {
  const { viewBox } = props;
  const { x, y } = viewBox;
  return (
    <text
      x={x - 10}
      y={y + 15}
      fill="#64748b"
      textAnchor="start"
      transform={`rotate(90, ${x - 10}, ${y + 15})`}
      className="font-bold tracking-widest uppercase"
      style={{ fontSize: '9px' }}
    >
      Retirement year
    </text>
  );
};

const formatCurrencyAxis = (value: number) => {
  if (value === 0) return '$0';
  if (value < 1000000) return `$${value / 1000}k`;
  return `$${value / 1000000}M`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 shadow-lg rounded-sm text-sm">
        <p className="font-bold mb-2 text-slate-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600 capitalize">
              {entry.name}
            </span>
            <span className="font-mono font-medium ml-auto">
              ${(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartSectionProps {
  projectionType?: ProjectionType;
  projectionData: ProjectionData[];
  cashFlowData: CashFlowData[];
  retirementYear: number;
  summaryStats?: {
    avgMonthlyIncome: number;
    belowAvgMonthlyIncome: number;
    sigBelowAvgMonthlyIncome: number;
    monthlyNeed: number;
  };
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
  projectionType = ProjectionType.ASSET_PROJECTION,
  projectionData,
  cashFlowData,
  retirementYear,
  summaryStats
}) => {
  const [showCashFlowModal, setShowCashFlowModal] = useState(false);
  
  const startYear = projectionData.length > 0 ? projectionData[0].year : CURRENT_YEAR;
  const endYear = projectionData.length > 0 ? projectionData[projectionData.length - 1].year : CURRENT_YEAR + 60;

  const monthlyIncome = summaryStats?.sigBelowAvgMonthlyIncome || 0;
  const monthlyNeed = summaryStats?.monthlyNeed || 0;
  const excess = monthlyIncome - monthlyNeed;
  const coveragePct = monthlyNeed > 0 ? Math.round((monthlyIncome / monthlyNeed) * 100) : 0;

  if (projectionType === ProjectionType.MONTHLY_CASH_FLOW) {
    return (
      <div className="w-full min-h-[450px] md:min-h-[500px] bg-slate-50/50 p-4 md:p-8 rounded-sm border border-transparent flex flex-col relative">
        <p className="text-slate-800 mb-8 md:mb-12 text-sm md:text-base leading-relaxed">
          You may be on pace to cover <span className="font-semibold">{coveragePct}%</span> of your monthly expenses in retirement (in today's dollars).
        </p>

        <div className="space-y-10 md:space-y-12 max-w-4xl mb-12 md:mb-16">
          <div className="flex items-center">
             <div className="w-20 md:w-24 text-slate-600 font-bold text-xs md:text-sm uppercase tracking-wide">Income</div>
             <div className="flex-grow relative h-10 md:h-12">
                <div className="absolute top-0 left-0 h-full bg-[#0f172a] w-full" style={{ width: '100%' }}></div>
                <span className="absolute -top-6 right-0 font-bold text-slate-900 text-xs md:text-sm">${monthlyIncome.toLocaleString()}</span>
             </div>
          </div>

          <div className="flex items-center">
             <div className="w-20 md:w-24 text-slate-600 font-bold text-xs md:text-sm uppercase tracking-wide">Expenses</div>
             <div className="flex-grow relative h-10 md:h-12">
                <div 
                    className="absolute top-0 left-0 h-full bg-[#0ea5e9]" 
                    style={{ width: `${Math.min(100, (monthlyNeed / monthlyIncome) * 100)}%` }}
                ></div>
                <span 
                    className="absolute -top-6 font-bold text-slate-900 pl-1 text-xs md:text-sm"
                    style={{ left: `${Math.min(100, (monthlyNeed / monthlyIncome) * 100)}%` }}
                >
                    ${monthlyNeed.toLocaleString()}
                </span>
             </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-6 md:pt-8">
            <div className="flex items-baseline gap-4 mb-6 md:mb-8">
              <h4 className="font-bold text-slate-800 text-xs md:text-sm uppercase tracking-widest">Monthly averages</h4>
              <button 
                onClick={() => setShowCashFlowModal(true)}
                className="text-xs text-slate-500 underline decoration-dotted underline-offset-4 decoration-slate-400 hover:text-slate-800 focus:outline-none"
              >
                Learn more
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div>
                <div className="text-xl md:text-2xl text-slate-800 font-normal mb-1 md:mb-2">${monthlyIncome.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px] md:text-sm">
                  <span>You may have</span>
                  <div className="bg-slate-700 rounded-full w-3.5 h-3.5 flex items-center justify-center cursor-help">
                    <span className="text-[9px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xl md:text-2xl text-slate-800 font-normal mb-1 md:mb-2">${monthlyNeed.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px] md:text-sm">
                  <span>You may need</span>
                  <div className="bg-slate-700 rounded-full w-3.5 h-3.5 flex items-center justify-center cursor-help">
                    <span className="text-[9px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              <div>
                <div className={`text-xl md:text-2xl font-normal mb-1 md:mb-2 ${excess >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                  ${excess.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px] md:text-sm">
                  <span>{excess >= 0 ? 'Excess income' : 'Shortfall'}</span>
                   <div className="bg-slate-700 rounded-full w-3.5 h-3.5 flex items-center justify-center cursor-help">
                    <span className="text-[9px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {showCashFlowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCashFlowModal(false)}></div>
            <div className="relative bg-white rounded shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">About this chart</h3>
                <button onClick={() => setShowCashFlowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X size={24} strokeWidth={1.5} /></button>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  This chart provides a snapshot of your estimated average monthly cash flow in retirement, comparing what you might have coming in versus what you might need to spend, all adjusted for inflation to reflect <strong>today's dollars</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] md:h-[550px] lg:h-[600px] bg-slate-50/40 p-1 md:p-4 pb-8 md:pb-12 rounded-sm border border-transparent -mx-1 md:mx-0 overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        {projectionType === ProjectionType.YEARLY_CASH_FLOW ? (
           <ComposedChart data={cashFlowData} margin={{ top: 20, right: 15, left: 5, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} domain={[retirementYear, endYear]} type="number" tickCount={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={formatCurrencyAxis} orientation="right" domain={[0, 'auto']} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fixedIncome" name="Fixed Income" stackId="a" fill="#eab308" barSize={16} />
              <Bar dataKey="variableIncome" name="Variable Income" stackId="a" fill="#0f172a" barSize={16} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#000000" strokeWidth={2} dot={false} />
           </ComposedChart>
        ) : (
          <AreaChart data={projectionData} margin={{ top: 30, right: 15, left: 5, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} domain={[startYear, endYear]} type="number" ticks={[startYear, retirementYear, endYear]} padding={{ left: 5, right: 5 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={formatCurrencyAxis} orientation="right" domain={[0, 'auto']} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={retirementYear} stroke="#0f172a" label={<CustomReferenceLabel />} strokeWidth={2} />
            <Area type="monotone" dataKey="average" stroke={CHART_COLORS.average} fill={CHART_COLORS.average} fillOpacity={1} strokeWidth={1} name="Average" />
            <Area type="monotone" dataKey="belowAverage" stroke="#475569" fill={CHART_COLORS.belowAverage} fillOpacity={1} strokeWidth={1} name="Below average" />
            <Area type="monotone" dataKey="significantlyBelowAverage" stroke={CHART_COLORS.sigBelowAverage} fill={CHART_COLORS.sigBelowAverage} fillOpacity={1} strokeWidth={1} name="Significantly below average" />
          </AreaChart>
        )}
      </ResponsiveContainer>
      
      {projectionType === ProjectionType.ASSET_PROJECTION && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-6 ml-4 pb-4 text-[10px] md:text-xs text-slate-700 font-medium border-b border-transparent">
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-300"></div><span>Average market</span></div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-500"></div><span>Below average market</span></div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-900"></div><span>Significantly below average market</span></div>
        </div>
      )}
    </div>
  );
};

export default ChartSection;