
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
      x={x - 12}
      y={y + 20}
      fill="#64748b"
      textAnchor="start"
      transform={`rotate(90, ${x - 12}, ${y + 20})`}
      className="font-medium tracking-widest uppercase text-slate-500"
      style={{ fontSize: '10px' }}
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

  // For the monthly cash flow view, use the dynamic stats calculated from Real Returns
  const monthlyIncome = summaryStats?.sigBelowAvgMonthlyIncome || 0;
  const monthlyNeed = summaryStats?.monthlyNeed || 0;
  const excess = monthlyIncome - monthlyNeed;
  const coveragePct = monthlyNeed > 0 ? Math.round((monthlyIncome / monthlyNeed) * 100) : 0;

  if (projectionType === ProjectionType.MONTHLY_CASH_FLOW) {
    return (
      <div className="w-full min-h-[450px] bg-slate-50/50 p-8 rounded-sm border border-transparent flex flex-col relative">
        <p className="text-slate-800 mb-12">
          You may be on pace to cover <span className="font-semibold">{coveragePct}%</span> of your monthly expenses in retirement (in today's dollars).
        </p>

        <div className="space-y-12 max-w-4xl mb-16">
          <div className="flex items-center">
             <div className="w-24 text-slate-600 font-medium text-sm">Income</div>
             <div className="flex-grow relative h-12">
                <div className="absolute top-0 left-0 h-full bg-[#0f172a] w-full" style={{ width: '100%' }}></div>
                <span className="absolute -top-7 right-0 font-bold text-slate-900">${monthlyIncome.toLocaleString()}</span>
             </div>
          </div>

          <div className="flex items-center">
             <div className="w-24 text-slate-600 font-medium text-sm">Expenses</div>
             <div className="flex-grow relative h-12">
                {/* Visual bar represents the ratio of expenses to income */}
                <div 
                    className="absolute top-0 left-0 h-full bg-[#0ea5e9]" 
                    style={{ width: `${Math.min(100, (monthlyNeed / monthlyIncome) * 100)}%` }}
                ></div>
                <span 
                    className="absolute -top-7 font-bold text-slate-900 pl-1"
                    style={{ left: `${Math.min(100, (monthlyNeed / monthlyIncome) * 100)}%` }}
                >
                    ${monthlyNeed.toLocaleString()}
                </span>
             </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-8">
            <div className="flex items-baseline gap-4 mb-8">
              <h4 className="font-bold text-slate-800 text-sm">Monthly averages</h4>
              <button 
                onClick={() => setShowCashFlowModal(true)}
                className="text-sm text-slate-500 underline decoration-dotted underline-offset-4 decoration-slate-400 hover:text-slate-800 focus:outline-none"
              >
                Learn more about the chart
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">${monthlyIncome.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>You may have</span>
                  <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">${monthlyNeed.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>You may need</span>
                  <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">${excess.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>{excess >= 0 ? 'Excess income' : 'Shortfall'}</span>
                   <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
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
                <h3 className="text-xl font-bold text-slate-800">About this chart</h3>
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

  // Yearly and Asset charts remain mostly same but handle dynamic ticks better
  return (
    <div className="w-full h-[450px] bg-slate-50/50 p-4 rounded-sm border border-transparent">
      <ResponsiveContainer width="100%" height="100%">
        {projectionType === ProjectionType.YEARLY_CASH_FLOW ? (
           <ComposedChart data={cashFlowData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} domain={[retirementYear, endYear]} type="number" tickCount={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} tickFormatter={formatCurrencyAxis} orientation="right" domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="fixedIncome" name="Fixed Income" stackId="a" fill="#eab308" barSize={20} />
              <Bar dataKey="variableIncome" name="Variable Income" stackId="a" fill="#0f172a" barSize={20} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#000000" strokeWidth={2} dot={false} />
           </ComposedChart>
        ) : (
          <AreaChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} domain={[startYear, endYear]} type="number" ticks={[startYear, retirementYear, endYear]} padding={{ left: 10, right: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} tickFormatter={formatCurrencyAxis} orientation="right" domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={retirementYear} stroke="#0f172a" label={<CustomReferenceLabel />} />
            <Area type="monotone" dataKey="average" stroke={CHART_COLORS.average} fill={CHART_COLORS.average} fillOpacity={1} strokeWidth={1} name="average" />
            <Area type="monotone" dataKey="belowAverage" stroke="#475569" fill={CHART_COLORS.belowAverage} fillOpacity={1} strokeWidth={1} name="belowAverage" />
            <Area type="monotone" dataKey="significantlyBelowAverage" stroke={CHART_COLORS.sigBelowAverage} fill={CHART_COLORS.sigBelowAverage} fillOpacity={1} strokeWidth={1} name="significantlyBelowAverage" />
          </AreaChart>
        )}
      </ResponsiveContainer>
      
      {projectionType === ProjectionType.ASSET_PROJECTION && (
        <div className="flex flex-wrap items-center gap-6 mt-2 ml-2 text-sm text-slate-700">
           <div className="flex items-center gap-2"><div className="w-4 h-1 bg-slate-300"></div><span>Average market</span></div>
           <div className="flex items-center gap-2"><div className="w-4 h-1 bg-slate-500"></div><span>Below average market</span></div>
           <div className="flex items-center gap-2"><div className="w-4 h-1 bg-slate-900"></div><span>Significantly below average market</span></div>
        </div>
      )}
    </div>
  );
};

export default ChartSection;
