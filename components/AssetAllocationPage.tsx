import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Info, ExternalLink, HelpCircle, Star, ChevronRight, ChevronsUpDown, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell as BarCell, ReferenceLine, Tooltip } from 'recharts';
import { AppData, Account } from '../types';

interface AssetAllocationPageProps {
  data: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onBack: () => void;
  onNavigate: (step: number) => void;
}

const STRATEGIES = [
  { name: 'Short-term', description: 'Lowest volatility' },
  { name: 'Conservative', description: '' },
  { name: 'Moderate with income', description: '' },
  { name: 'Moderate', description: '' },
  { name: 'Balanced', description: '' },
  { name: 'Growth with income', description: '' },
  { name: 'Growth', description: '' },
  { name: 'Aggressive growth', description: 'Seeks high long-term returns', isRecommended: true },
  { name: 'Most aggressive', description: 'Highest volatility' },
];

const STRATEGY_ALLOCATIONS: Record<string, number[]> = {
  'Short-term': [0, 0, 0, 100, 0],
  'Conservative': [15, 5, 50, 30, 0],
  'Moderate with income': [25, 10, 45, 20, 0],
  'Moderate': [35, 15, 40, 10, 0],
  'Balanced': [42, 18, 35, 5, 0],
  'Growth with income': [50, 20, 25, 5, 0],
  'Growth': [55, 25, 15, 5, 0],
  'Aggressive growth': [60, 25, 10, 5, 0],
  'Most aggressive': [70, 30, 0, 0, 0],
};

const ASSET_CLASSES = [
  { name: 'Domestic', color: '#004a99' },
  { name: 'Foreign', color: '#00a0d2' },
  { name: 'Bonds', color: '#6ab023' },
  { name: 'Short term', color: '#ffc20e' },
  { name: 'Other', color: '#e57200' },
  { name: 'Unknown', color: '#6366f1' }, 
];

const HISTORICAL_RETURNS_DATA = [
  { period: '1 year', max: 136.07, min: -60.78, maxYear: '1932-1933', minYear: '1931-1932' },
  { period: '5 years', max: 31.91, min: -13.78, maxYear: '1928-1933', minYear: '1926-1931' },
  { period: '10 years', max: 19.19, min: -2.69, maxYear: '1949-1959', minYear: '1929-1939' },
  { period: '15 years', max: 17.85, min: 0.91, maxYear: '1984-1999', minYear: '1929-1944' },
  { period: '20 years', max: 16.49, min: 2.66, maxYear: '1980-2000', minYear: '1929-1949' },
  { period: '25 years', max: 15.79, min: 5.7, maxYear: '1975-2000', minYear: '1929-1954' },
];

const COMPARISON_DATA = {
  '1 year': [
    { mix: 'Short-term', max: 15.2, min: -0.04 },
    { mix: 'Conservative', max: 31.06, min: -17.67 },
    { mix: 'Moderate with income', max: 45.78, min: -25.99 },
    { mix: 'Moderate', max: 60.79, min: -33.62 },
    { mix: 'Balanced', max: 76.57, min: -40.64 },
    { mix: 'Growth with income', max: 93.08, min: -47.07 },
    { mix: 'Growth', max: 109.55, min: -52.92 },
    { mix: 'Aggressive growth', max: 136.07, min: -60.78 },
    { mix: 'Most aggressive', max: 162.89, min: -67.56 },
  ],
  '5 years': [
    { mix: 'Short-term', max: 11.5, min: 2.1 },
    { mix: 'Conservative', max: 18.2, min: -4.5 },
    { mix: 'Moderate with income', max: 21.4, min: -6.8 },
    { mix: 'Moderate', max: 24.1, min: -8.9 },
    { mix: 'Balanced', max: 26.5, min: -10.5 },
    { mix: 'Growth with income', max: 28.3, min: -11.4 },
    { mix: 'Growth', max: 30.1, min: -12.6 },
    { mix: 'Aggressive growth', max: 31.91, min: -13.78 },
    { mix: 'Most aggressive', max: 35.8, min: -15.4 },
  ],
};

const CustomHistoricalTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-300 p-4 shadow-xl rounded-sm text-xs pointer-events-none min-w-[200px]">
        <p className="font-bold mb-3 text-slate-800 text-[13px]">{label}</p>
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <span className="text-slate-600 font-medium">Highest:</span>
            <span className="font-bold text-slate-900">+{data.max}% {data.maxYear ? `(${data.maxYear})` : ''}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-slate-600 font-medium">Lowest:</span>
            <span className="font-bold text-slate-900">{data.min}% {data.minYear ? `(${data.minYear})` : ''}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const AssetAllocationPage: React.FC<AssetAllocationPageProps> = ({ data, updateData, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [subTab, setSubTab] = useState('Current allocation by account');
  const [selectedStrategy, setSelectedStrategy] = useState(data.modeledStrategy || 'Aggressive growth');
  const [isLoading, setIsLoading] = useState(true);
  const [historicalViewMode, setHistoricalViewMode] = useState<'Chart' | 'Table'>('Chart');
  const [comparisonPeriod, setComparisonPeriod] = useState<'1 year' | '5 years'>('1 year');

  const { accounts, household } = data;

  // Calculate account statistics and dynamic table rows
  const { totalBalance, assignedCount, totalCount, tableRows, currentMixData } = useMemo(() => {
    const filtered = accounts.filter(acc => {
      if (!household.planningWithPartner && acc.owner === 'MONEY') return false;
      return true;
    });

    const accountsForRetirement = filtered.filter(a => a.goal === 'RETIREMENT');
    const total = accountsForRetirement.reduce((sum, a) => sum + a.value, 0);
    const assigned = accountsForRetirement.length;
    
    // Aggregate weighted breakdown for the Pie Chart
    let aggDomestic = 0, aggForeign = 0, aggBonds = 0, aggShortTerm = 0, aggOther = 0;

    const rows = accountsForRetirement.map(acc => {
        const breakdown = acc.assetBreakdown || { domestic: 0, foreign: 0, bonds: 0, shortTerm: 0, other: 0 };
        
        // Accumulate weighted values
        aggDomestic += (breakdown.domestic / 100) * acc.value;
        aggForeign += (breakdown.foreign / 100) * acc.value;
        aggBonds += (breakdown.bonds / 100) * acc.value;
        aggShortTerm += (breakdown.shortTerm / 100) * acc.value;
        aggOther += (breakdown.other / 100) * acc.value;

        return {
            name: acc.name,
            number: acc.number,
            balance: acc.value,
            pctOfGoal: total > 0 ? `${((acc.value / total) * 100).toFixed(2)}%` : '0%',
            domestic: `${breakdown.domestic}%`,
            foreign: `${breakdown.foreign}%`,
            bonds: `${breakdown.bonds}%`,
            shortTerm: `${breakdown.shortTerm}%`,
            other: breakdown.other > 0 ? `${breakdown.other}%` : '',
            unknown: ''
        };
    });

    const mixData = total > 0 ? [
        { name: 'Domestic stock', value: Number(((aggDomestic / total) * 100).toFixed(1)), color: '#004a99' },
        { name: 'Foreign stock', value: Number(((aggForeign / total) * 100).toFixed(1)), color: '#00a0d2' },
        { name: 'Bonds', value: Number(((aggBonds / total) * 100).toFixed(1)), color: '#6ab023' },
        { name: 'Short term', value: Number(((aggShortTerm / total) * 100).toFixed(1)), color: '#ffc20e' },
        { name: 'Other', value: Number(((aggOther / total) * 100).toFixed(1)), color: '#e57200' },
    ] : [];
    
    return {
      totalBalance: total,
      assignedCount: assigned,
      totalCount: filtered.length,
      tableRows: rows,
      currentMixData: mixData
    };
  }, [accounts, household.planningWithPartner]);

  const targetMixData = useMemo(() => {
    const allocation = STRATEGY_ALLOCATIONS[selectedStrategy] || [0, 0, 0, 0, 0];
    return [
      { name: 'Domestic stock', value: allocation[0], color: '#004a99' },
      { name: 'Foreign stock', value: allocation[1], color: '#00a0d2' },
      { name: 'Bonds', value: allocation[2], color: '#6ab023' },
      { name: 'Short term', value: allocation[3], color: '#ffc20e' },
      { name: 'Other', value: allocation[4], color: '#e57200' },
    ];
  }, [selectedStrategy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateAnalysis = () => {
    updateData({ modeledStrategy: selectedStrategy });
    onBack();
  };

  const renderCurrentMix = (showStats = true) => (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
        <div className="text-[11px] text-slate-400 font-medium mb-4">As of 12/16/2025</div>
        <div className="w-40 h-40 relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={currentMixData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={450}
                    >
                        {currentMixData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="w-full max-w-[240px] space-y-1.5 mb-8">
            {currentMixData.map((item, index) => (
                item.value > 0 && (
                <div key={index} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-700 font-bold">{item.value}%</span>
                </div>
                )
            ))}
        </div>
        {showStats && (
          <div className="w-full max-w-[340px] flex justify-between items-start border-t border-slate-100 pt-6">
              <div className="flex flex-col items-start">
                  <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Total balance</span>
                  <span className="text-sm font-bold text-slate-700">${Math.round(totalBalance).toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Accounts assigned</span>
                  <span className="text-sm font-bold text-slate-700">{assignedCount} of {totalCount} accounts</span>
              </div>
          </div>
        )}
    </div>
  );

  // Transform data for floating range bars
  const transformedHistoricalData = useMemo(() => {
      return HISTORICAL_RETURNS_DATA.map(d => ({
          ...d,
          posRange: [Math.max(0, d.min), d.max],
          negRange: [d.min, Math.min(0, d.max)],
          hasNegative: d.min < 0
      }));
  }, []);

  const transformedComparisonData = useMemo(() => {
    return COMPARISON_DATA[comparisonPeriod].map(d => ({
      ...d,
      posRange: [Math.max(0, d.min), d.max],
      negRange: [d.min, Math.min(0, d.max)]
    }));
  }, [comparisonPeriod]);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-300 pb-24">
      {/* Fidelity-style Header Banner */}
      <div className="bg-[#4d7c0f] h-12 w-full flex items-center px-4 md:px-12">
          <span className="text-white text-base font-bold">Retirement Planning</span>
      </div>

      <div className="p-4 md:p-12 max-w-7xl mx-auto">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
        >
            <ArrowLeft size={16} />
            Back to Retirement analysis
        </button>

        <h1 className="text-3xl font-light text-slate-800 mb-4">Asset mix and allocation</h1>
        
        <p className="text-slate-600 text-sm leading-relaxed max-w-5xl mb-12">
            Your personal investment strategy can be an important factor to achieving your goals. Review your current asset mix below, and model a change in asset mix to help you evaluate the potential impact for your retirement plan. This modeling will not change your current asset mix or portfolio. <a href="#" className="text-blue-700 hover:underline inline-flex items-center gap-1 font-medium decoration-1 underline-offset-2">Learn more about personalized investing strategies <ExternalLink size={14} /></a>
        </p>

        {/* Tab Selection */}
        <div className="border-b border-slate-300 flex flex-wrap gap-12 mb-12">
            <button 
                onClick={() => setActiveTab(0)}
                className={`pb-3 text-sm font-bold border-b-4 transition-colors ${activeTab === 0 ? 'border-[#4d7c0f] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Suggested target asset mix to consider
            </button>
            <button 
                onClick={() => setActiveTab(1)}
                className={`pb-3 text-sm font-bold border-b-4 transition-colors ${activeTab === 1 ? 'border-[#4d7c0f] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Explore other target asset mixes
            </button>
        </div>

        {activeTab === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-800">Current asset mix</h2>
                        <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                            <span className="text-[10px] text-white font-bold italic">i</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        This is how you are currently invested for retirement across different asset classes. <a href="#" className="text-blue-700 hover:underline">Learn more about asset classes.</a>
                    </p>

                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-slate-400 animate-spin" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Loading</span>
                            </div>
                        ) : renderCurrentMix()}
                    </div>
                </div>

                <div className="bg-white p-2">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Suggested target asset mix to consider</h2>
                        <div className="bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                            <span className="text-[10px] text-slate-500 font-bold">?</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-12 leading-relaxed max-w-md">
                        Answer a few questions to get an investment strategy that might better fit your needs and goal.
                    </p>
                    
                    <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-10 rounded-full text-sm transition-colors shadow-sm">
                        Complete an investor profile
                    </button>
                </div>
            </div>
        ) : (
            <div className="animate-in fade-in duration-500">
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Select a target asset mix</h2>
                    <p className="text-sm text-slate-600 mb-4 max-w-5xl leading-relaxed">
                        Select an asset mix from one of the options below to explore the potential impact on your retirement analysis by clicking on "update analysis".
                    </p>
                    <p className="text-xs text-slate-500 italic mb-10">
                        Keep in mind, some of these target asset mixes may not be suitable for your goal based on what you told us in your investor profile.
                    </p>

                    <div className="flex justify-between items-start max-w-6xl mb-16 px-4">
                        {STRATEGIES.map((strategy) => (
                            <div key={strategy.name} className="flex flex-col items-center flex-1 min-w-0">
                                <div className="h-12 flex flex-col items-center justify-end mb-2">
                                    {strategy.isRecommended && (
                                        <div className="flex flex-col items-center mb-1">
                                            <Star size={14} className="fill-slate-800 text-slate-800 mb-1" />
                                            <div className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                                                <span className="text-[10px] text-slate-600 font-bold italic">i</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedStrategy(strategy.name)}
                                    className={`w-6 h-6 rounded-full border-2 mb-4 transition-all flex items-center justify-center ${selectedStrategy === strategy.name ? 'border-blue-700 ring-2 ring-blue-100 ring-offset-2' : 'border-slate-300'}`}
                                >
                                    {selectedStrategy === strategy.name && <div className="w-3 h-3 rounded-full bg-blue-700" />}
                                </button>
                                <span className={`text-[11px] text-center font-bold px-1 transition-colors ${selectedStrategy === strategy.name ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {strategy.name}
                                </span>
                                {strategy.description && (
                                    <span className="text-[10px] text-slate-400 text-center mt-1 leading-tight px-2">{strategy.description}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-100 pt-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Current asset mix</h2>
                            <div className="bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                                <span className="text-[10px] text-white font-bold italic">i</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                            This is how you are currently invested for retirement across different asset classes. <a href="#" className="text-blue-700 hover:underline">Learn more about asset classes.</a>
                        </p>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                            </div>
                        ) : renderCurrentMix(true)}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Time based target asset mix</h2>
                            <div className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center cursor-help">
                                <span className="text-[10px] text-slate-600 font-bold italic">i</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                            Based on the number of years from retirement, a default <span className="font-bold">{selectedStrategy}</span> was selected as a starting point for exploration. It may be more aggressive or conservative than your current asset mix.
                        </p>
                        
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                                <div className="text-[11px] text-slate-400 font-medium mb-4">&nbsp;</div>
                                <div className="w-40 h-40 relative mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={targetMixData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={78}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                                startAngle={90}
                                                endAngle={450}
                                            >
                                                {targetMixData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full max-w-[240px] space-y-1.5 mb-12">
                                    {targetMixData.map((item, index) => {
                                        if (item.value === 0) return null;
                                        return (
                                            <div key={index} className="flex items-center justify-between text-[12px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-slate-600 font-medium">{item.name}</span>
                                                </div>
                                                <span className="text-slate-700 font-bold">{item.value}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex flex-col gap-3 w-full max-w-[280px]">
                                    <button 
                                        onClick={handleUpdateAnalysis}
                                        className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-8 rounded-full text-sm transition-all shadow-sm"
                                    >
                                        Update analysis
                                    </button>
                                    <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-8 rounded-full text-sm transition-all">
                                        Complete an investor profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <div className="mt-24 border-t border-slate-200 pt-16">
            <div className="border-b border-slate-300 flex flex-wrap gap-10 mb-8">
                {['Current allocation by account', 'Current & target comparisons', "Target's historical returns", "Target's historical return comparison"].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`pb-3 text-sm font-bold border-b-4 transition-colors ${subTab === tab ? 'border-[#4d7c0f] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {subTab === 'Current allocation by account' && (
                <div className="animate-in fade-in duration-500">
                    <div className="overflow-x-auto border border-slate-200 rounded-sm shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-[#f8fafc] border-b border-slate-200">
                                <tr>
                                    <th className="p-3 text-[11px] font-bold text-slate-700 border-r border-slate-200 w-48">
                                        <div className="flex items-center gap-1 uppercase tracking-wider">Account name <ChevronsUpDown size={12} className="text-slate-400" /></div>
                                    </th>
                                    <th className="p-3 text-[11px] font-bold text-slate-700 border-r border-slate-200">
                                        <div className="flex items-center gap-1 uppercase tracking-wider">Account balance <ChevronsUpDown size={12} className="text-slate-400" /></div>
                                    </th>
                                    <th className="p-3 text-[11px] font-bold text-slate-700 border-r border-slate-200 text-center">
                                        <div className="flex items-center justify-center gap-1 uppercase tracking-wider">% of goal <ChevronsUpDown size={12} className="text-slate-400" /></div>
                                    </th>
                                    {ASSET_CLASSES.map(ac => (
                                        <th key={ac.name} className="p-3 text-[11px] font-bold text-slate-700 border-r last:border-r-0 border-slate-200 text-center">
                                            <div className="flex flex-col items-center gap-1 uppercase tracking-wider">
                                                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: ac.color }}></div>
                                                <div className="flex items-center gap-1">{ac.name} <ChevronsUpDown size={10} className="text-slate-400" /></div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, idx) => (
                                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100 hover:bg-blue-50/30 transition-colors`}>
                                        <td className="p-4 border-r border-slate-100">
                                            <div className="text-[12px] font-bold text-slate-800 uppercase leading-tight">{row.name}</div>
                                            <div className="text-[11px] text-slate-500 font-medium mt-1">{row.number}</div>
                                        </td>
                                        <td className="p-4 border-r border-slate-100">
                                            <div className="text-[12px] font-bold text-slate-800">${row.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase">As of 12/16/25</div>
                                        </td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-600">
                                            {row.pctOfGoal}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-700">{row.domestic}</td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-700">{row.foreign}</td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-700">{row.bonds}</td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-700">{row.shortTerm}</td>
                                        <td className="p-4 border-r border-slate-100 text-center text-[12px] font-medium text-slate-700">{row.other}</td>
                                        <td className="p-4 text-center text-[12px] font-medium text-slate-700">{row.unknown}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {subTab === 'Current & target comparisons' && (
                <div className="animate-in fade-in duration-500">
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">The asset allocation process: The importance of rebalancing</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-5xl">
                            Your target asset allocation is just the beginning. Maintaining the appropriate allocation in line with your situation and the broader economy is an ongoing cyclical process.
                        </p>
                        <a href="#" className="text-blue-700 hover:underline inline-flex items-center gap-1 font-medium text-sm decoration-1 underline-offset-2">
                            Learn more about being a disciplined investor <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-[#f1f5f9] border-b border-slate-200">
                                <tr>
                                    <th className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200 w-56">Asset mix</th>
                                    {ASSET_CLASSES.slice(0, 5).map(ac => (
                                        <th key={ac.name} className="p-5 text-sm font-bold text-slate-700 border-r last:border-r-0 border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ac.color }}></div>
                                                {ac.name}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b border-slate-200">
                                    <td className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200">Target</td>
                                    {targetMixData.map((item, i) => (
                                        <td key={i} className="p-5 text-sm font-medium text-slate-700 border-r last:border-r-0 border-slate-200">{item.value}%</td>
                                    ))}
                                </tr>
                                <tr className="bg-[#f8fafc] border-b border-slate-200">
                                    <td className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200">Current</td>
                                    {currentMixData.map((item, i) => (
                                        <td key={i} className="p-5 text-sm font-medium text-slate-700 border-r last:border-r-0 border-slate-200">{item.value}%</td>
                                    ))}
                                </tr>
                                <tr className="bg-white">
                                    <td className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200">Comparison</td>
                                    {targetMixData.map((item, i) => {
                                        const currentVal = currentMixData.find(m => m.name === item.name)?.value || 0;
                                        const diff = item.value - currentVal;
                                        return (
                                            <td key={i} className="p-5 text-sm font-bold border-r last:border-r-0 border-slate-200 text-slate-700">
                                                {diff.toFixed(2)}%
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {subTab === "Target's historical returns" && (
                <div className="animate-in fade-in duration-500 flex flex-col items-center">
                    <div className="flex gap-0 mb-8 border border-slate-300 rounded-sm overflow-hidden">
                        <button 
                            onClick={() => setHistoricalViewMode('Chart')}
                            className={`px-6 py-2 text-sm font-bold transition-colors ${historicalViewMode === 'Chart' ? 'bg-[#4d7c0f] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Chart
                        </button>
                        <button 
                            onClick={() => setHistoricalViewMode('Table')}
                            className={`px-6 py-2 text-sm font-bold border-l border-slate-300 transition-colors ${historicalViewMode === 'Table' ? 'bg-[#4d7c0f] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Table
                        </button>
                    </div>

                    <div className="w-full max-w-5xl text-center space-y-4 mb-12">
                        <h2 className="text-xl font-normal text-slate-800">Historically, staying invested longer helped reduce exposure to short-term market fluctuations</h2>
                        <h3 className="text-lg font-bold text-slate-700 uppercase tracking-tight">{selectedStrategy} asset mix</h3>
                        <p className="text-xs text-slate-500">Annualized index returns 1926-2024: <span className="font-bold">9.62%</span></p>
                    </div>

                    {historicalViewMode === 'Chart' ? (
                        <div className="w-full max-w-5xl h-[480px] mt-8 flex flex-row">
                            <div className="flex-1 flex flex-col relative">
                              <div className="flex-1 relative">
                                  {/* Y Axis Vertical Legend - Moved closer as requested */}
                                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-[12px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Annualized returns (%)</div>
                                  
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart
                                          data={transformedHistoricalData}
                                          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
                                          barGap={-55} // Perfect overlap to ensure floating effect
                                      >
                                          <YAxis 
                                              domain={[-80, 150]} 
                                              ticks={[-61, 0, 136]} 
                                              axisLine={false} 
                                              tickLine={false} 
                                              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                              tickFormatter={(val) => `${val}%`}
                                              orientation="left"
                                              width={80}
                                          />
                                          
                                          <XAxis 
                                              dataKey="period" 
                                              axisLine={{ stroke: '#e2e8f0' }} 
                                              tickLine={false} 
                                              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }} 
                                              padding={{ left: 20, right: 20 }}
                                          />
                                          
                                          {/* Zero Baseline */}
                                          <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
                                          
                                          <Tooltip content={<CustomHistoricalTooltip />} cursor={{fill: 'transparent'}} />

                                          {/* Positive Part (Green) - Flows from max(0, min) to max */}
                                          <Bar dataKey="posRange" radius={[2, 2, 0, 0]} barSize={55}>
                                              {transformedHistoricalData.map((entry, index) => (
                                                  <BarCell key={`pos-cell-${index}`} fill="#14532d" />
                                              ))}
                                              <LabelList 
                                                  dataKey="posRange" 
                                                  position="top" 
                                                  formatter={(val: [number, number]) => `+${val[1]}%`} 
                                                  style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1e293b' }} 
                                              />
                                              {/* Bottom label if the bar is floating (both pos) */}
                                              <LabelList 
                                                  dataKey="posRange" 
                                                  position="bottom" 
                                                  formatter={(val: [number, number]) => val[0] > 0 ? `+${val[0]}%` : ''} 
                                                  style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1e293b' }} 
                                              />
                                          </Bar>

                                          {/* Negative Part (Red) - Flows from min to min(0, max) */}
                                          <Bar dataKey="negRange" radius={0} barSize={55}>
                                              {transformedHistoricalData.map((entry, index) => (
                                                  <BarCell key={`neg-cell-${index}`} fill="#7f1d1d" />
                                              ))}
                                              <LabelList 
                                                  dataKey="negRange" 
                                                  position="bottom" 
                                                  formatter={(val: [number, number]) => `${val[0]}%`} 
                                                  style={{ fontSize: '11px', fontWeight: 'bold', fill: '#1e293b' }} 
                                              />
                                          </Bar>
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                              <div className="text-center text-[12px] text-slate-700 font-bold uppercase tracking-tight mt-4 ml-[100px]">Amount of time assets held</div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-3xl overflow-hidden border border-slate-200 rounded-sm shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 font-bold text-slate-700">Holding Period</th>
                                        <th className="p-4 font-bold text-slate-700 text-center">Best Case</th>
                                        <th className="p-4 font-bold text-slate-700 text-center">Worst Case</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {HISTORICAL_RETURNS_DATA.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 text-slate-700 font-medium">{row.period}</td>
                                            <td className="p-4 text-center text-green-600 font-bold">+{row.max}%</td>
                                            <td className="p-4 text-center text-red-600 font-bold">{row.min}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {subTab === "Target's historical return comparison" && (
                <div className="animate-in fade-in duration-500">
                     <div className="w-full max-w-5xl text-center space-y-4 mb-12">
                        <h2 className="text-xl font-normal text-slate-800">Best/worst index returns by asset mix for selected time period from 1926-2024</h2>
                        <p className="text-sm text-slate-600">Select a different amount of time assets are held to compare index returns across model asset mixes below.</p>
                    </div>

                    <div className="flex items-center gap-4 mb-12">
                        <span className="text-sm font-bold text-slate-700">Time period</span>
                        <div className="relative inline-block w-40">
                            <select 
                                value={comparisonPeriod}
                                onChange={(e) => setComparisonPeriod(e.target.value as any)}
                                className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-700 py-2 px-4 pr-8 rounded-sm leading-tight focus:outline-none shadow-sm cursor-pointer text-sm font-medium"
                            >
                                <option value="1 year">1 year</option>
                                <option value="5 years">5 years</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-6xl h-[520px] flex flex-row mt-12">
                        <div className="flex-1 flex flex-col relative">
                            <div className="flex-1 relative">
                                 {/* Y Axis Vertical Legend */}
                                 <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-[12px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Annualized return (%)</div>
                                 
                                 <ResponsiveContainer width="100%" height="100%">
                                      <BarChart
                                          data={transformedComparisonData}
                                          margin={{ top: 40, right: 30, left: 20, bottom: 100 }}
                                          barGap={-40}
                                      >
                                          <YAxis 
                                              domain={[-80, 180]} 
                                              ticks={[-68, 0, 163]} 
                                              axisLine={false} 
                                              tickLine={false} 
                                              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                              tickFormatter={(val) => `${val}%`}
                                              orientation="left"
                                              width={80}
                                          />
                                          
                                          <XAxis 
                                              dataKey="mix" 
                                              axisLine={{ stroke: '#e2e8f0' }} 
                                              tickLine={false} 
                                              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700, angle: -45, textAnchor: 'end' }} 
                                              padding={{ left: 20, right: 20 }}
                                              interval={0}
                                          />
                                          
                                          <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />
                                          <Tooltip content={<CustomHistoricalTooltip />} cursor={{fill: 'transparent'}} />

                                          {/* Positive Part (Green) */}
                                          <Bar dataKey="posRange" radius={[2, 2, 0, 0]} barSize={40}>
                                              {transformedComparisonData.map((entry, index) => (
                                                  <BarCell key={`pos-cell-${index}`} fill="#14532d" />
                                              ))}
                                              <LabelList 
                                                  dataKey="posRange" 
                                                  position="top" 
                                                  formatter={(val: [number, number]) => `+${val[1]}%`} 
                                                  style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1e293b' }} 
                                              />
                                          </Bar>

                                          {/* Negative Part (Red) */}
                                          <Bar dataKey="negRange" radius={0} barSize={40}>
                                              {transformedComparisonData.map((entry, index) => (
                                                  <BarCell key={`neg-cell-${index}`} fill="#7f1d1d" />
                                              ))}
                                              <LabelList 
                                                  dataKey="negRange" 
                                                  position="bottom" 
                                                  formatter={(val: [number, number]) => `${val[0]}%`} 
                                                  style={{ fontSize: '10px', fontWeight: 'bold', fill: '#1e293b' }} 
                                              />
                                          </Bar>
                                      </BarChart>
                                 </ResponsiveContainer>
                            </div>
                            <div className="text-center text-[12px] text-slate-700 font-bold uppercase tracking-tight mt-[-60px] ml-[100px]">Asset mix</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationPage;