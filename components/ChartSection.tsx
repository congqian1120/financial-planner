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
import { ProjectionData, ProjectionType } from '../types';
import { PROJECTION_DATA, YEARLY_CASH_FLOW_DATA, RETIREMENT_YEAR, CHART_COLORS } from '../constants';

// Custom Label for the Reference Line to match the vertical text style
const CustomReferenceLabel = (props: any) => {
  const { viewBox } = props;
  const { x, y } = viewBox;
  
  // Position the text to the left of the line (x - 12)
  // Start near the top (y + 20)
  // Rotate 90 degrees clockwise to read top-to-bottom
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
}

const ChartSection: React.FC<ChartSectionProps> = ({ projectionType = ProjectionType.ASSET_PROJECTION }) => {
  const [showCashFlowModal, setShowCashFlowModal] = useState(false);

  if (projectionType === ProjectionType.MONTHLY_CASH_FLOW) {
    return (
      <div className="w-full min-h-[450px] bg-slate-50/50 p-8 rounded-sm border border-transparent flex flex-col relative">
        <p className="text-slate-800 mb-12">
          You may be on pace to cover <span className="font-semibold">150+%</span> of your monthly expenses in retirement.
        </p>

        <div className="space-y-12 max-w-4xl mb-16">
          {/* Income Bar */}
          <div className="flex items-center">
             <div className="w-24 text-slate-600 font-medium">Income</div>
             <div className="flex-grow relative h-12">
                <div className="absolute top-0 left-0 h-full bg-[#0f172a] w-full" style={{ width: '100%' }}></div>
                <span className="absolute -top-7 right-0 font-bold text-slate-900">$25,013</span>
             </div>
          </div>

          {/* Expenses Bar */}
          <div className="flex items-center">
             <div className="w-24 text-slate-600 font-medium">Expenses</div>
             <div className="flex-grow relative h-12">
                <div className="absolute top-0 left-0 h-full bg-[#0ea5e9] w-[55%]"></div>
                 <span className="absolute -top-7 left-[55%] font-bold text-slate-900 pl-1">$13,741</span>
             </div>
          </div>
        </div>

        {/* Monthly Averages Section */}
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
              {/* Card 1 */}
              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">
                  $25,013
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>You may have</span>
                  <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">
                  $13,741
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>You may need</span>
                  <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div>
                <div className="text-2xl text-slate-800 font-normal mb-2">
                  $11,272
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <span>Excess income</span>
                   <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                    <span className="text-[10px] text-white font-bold">?</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Cash Flow Modal */}
        {showCashFlowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowCashFlowModal(false)}
            ></div>
            <div className="relative bg-white rounded shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">About this chart</h3>
                <button 
                  onClick={() => setShowCashFlowModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                  This chart provides a snapshot of your estimated average monthly cash flow in retirement, comparing what you might have coming in versus what you might need to spend.
                </p>
                <div className="space-y-6">
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Income (You may have)</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        This is the estimated monthly average of your total income sources, including Social Security, pensions, annuities, and sustainable withdrawals from your investment portfolio.
                      </p>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Expenses (You may need)</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        This represents your projected monthly spending needs, covering both essential expenses (like housing and healthcare) and discretionary spending.
                      </p>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Excess Income</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        The difference between your estimated income and expenses. A positive number suggests a surplus, while a negative number would indicate a potential gap.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (projectionType === ProjectionType.YEARLY_CASH_FLOW) {
     return (
        <div className="w-full h-[450px] bg-slate-50/50 p-4 rounded-sm border border-transparent">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={YEARLY_CASH_FLOW_DATA}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 13 }}
                ticks={[2065, 2070, 2075, 2080, 2085, 2090]}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 13 }}
                tickFormatter={formatCurrencyAxis}
                domain={[0, 500000]}
                ticks={[0, 100000, 200000, 300000, 400000, 500000]}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar dataKey="fixedIncome" name="Fixed Income" stackId="a" fill="#eab308" barSize={20} />
              <Bar dataKey="variableIncome" name="Variable Income" stackId="a" fill="#0f172a" barSize={20} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#000000" strokeWidth={2} dot={false} />

            </ComposedChart>
          </ResponsiveContainer>
        </div>
     );
  }

  return (
    <div className="w-full h-[450px] bg-slate-50/50 p-4 rounded-sm border border-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={PROJECTION_DATA}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#475569', fontSize: 13 }}
            ticks={[2025, 2061, 2091]}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#475569', fontSize: 13 }}
            tickFormatter={formatCurrencyAxis}
            domain={[0, 80000000]}
            ticks={[0, 20000000, 40000000, 60000000, 80000000]}
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine 
            x={RETIREMENT_YEAR} 
            stroke="#0f172a" 
            strokeDasharray="0"
            label={<CustomReferenceLabel />}
          />

          {/* Render in reverse order of magnitude to ensure stacking visibility */}
          {/* Average Market (Largest) - rendered first (bottom layer) */}
          <Area
            type="monotone"
            dataKey="average"
            stackId="1" 
            // Note: We aren't stacking values (stackId makes them sum up). 
            // We want them to overlap. Removing stackId or using different IDs makes them independent.
            // Using different IDs to allow overlap.
            stroke={CHART_COLORS.average}
            fill={CHART_COLORS.average}
            fillOpacity={1}
            strokeWidth={1}
            activeDot={{ r: 4 }}
            name="average"
          />
          
          {/* Below Average (Middle) */}
          <Area
            type="monotone"
            dataKey="belowAverage"
            stroke="#475569"
            fill={CHART_COLORS.belowAverage}
            fillOpacity={1}
            strokeWidth={1}
            activeDot={{ r: 4 }}
            name="belowAverage"
          />

          {/* Significantly Below Average (Smallest) - rendered last (top layer) */}
          <Area
            type="monotone"
            dataKey="significantlyBelowAverage"
            stroke={CHART_COLORS.sigBelowAverage}
            fill={CHART_COLORS.sigBelowAverage}
            fillOpacity={1}
            strokeWidth={1}
            activeDot={{ r: 4 }}
            name="significantlyBelowAverage"
          />

        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-2 ml-2 text-sm text-slate-700">
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-slate-300"></div>
            <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">Average market</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-slate-500"></div>
            <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">Below average market</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-slate-900"></div>
            <span className="underline decoration-dotted underline-offset-4 decoration-slate-400 cursor-help">Significantly below average market</span>
         </div>
      </div>
    </div>
  );
};

export default ChartSection;