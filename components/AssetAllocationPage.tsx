import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Info, ExternalLink, HelpCircle, Star, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell as BarCell, ReferenceLine } from 'recharts';
import { AppData, Account } from '../types';

interface AssetAllocationPageProps {
  data: AppData;
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

const ASSET_CLASSES = [
  { name: 'Domestic', color: '#004a99' },
  { name: 'Foreign', color: '#00a0d2' },
  { name: 'Bonds', color: '#6ab023' },
  { name: 'Short term', color: '#ffc20e' },
  { name: 'Other', color: '#e57200' },
  { name: 'Unknown', color: '#6366f1' }, 
];

const HISTORICAL_RETURNS_DATA = [
  { period: '1 year', max: 136.07, min: -60.78 },
  { period: '5 years', max: 31.91, min: -13.78 },
  { period: '10 years', max: 19.19, min: -2.69 },
  { period: '15 years', max: 17.85, min: 0.91 },
  { period: '20 years', max: 16.49, min: 2.66 },
  { period: '25 years', max: 15.79, min: 5.7 },
];

const AssetAllocationPage: React.FC<AssetAllocationPageProps> = ({ data, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [subTab, setSubTab] = useState('Current allocation by account');
  const [selectedStrategy, setSelectedStrategy] = useState('Aggressive growth');
  const [isLoading, setIsLoading] = useState(true);
  const [historicalViewMode, setHistoricalViewMode] = useState<'Chart' | 'Table'>('Chart');

  const { accounts, household } = data;

  // Calculate account statistics
  const { totalBalance, assignedCount, totalCount, visibleAccounts } = useMemo(() => {
    const filtered = accounts.filter(acc => {
      if (!household.planningWithPartner && acc.owner === 'MONEY') return false;
      return true;
    });

    const total = filtered
      .filter(a => a.goal === 'RETIREMENT')
      .reduce((sum, a) => sum + a.value, 0);
    
    const assigned = filtered.filter(a => a.goal === 'RETIREMENT').length;
    
    return {
      totalBalance: total,
      assignedCount: assigned,
      totalCount: filtered.length,
      visibleAccounts: filtered.filter(a => a.goal === 'RETIREMENT')
    };
  }, [accounts, household.planningWithPartner]);

  // Comparison Table Data
  const comparisonData = {
    target: [60, 25, 15, 0, 0, 0],
    current: [78.78, 13.2, 6.89, 0.98, 0.16, 0],
    comparison: [-18.78, 11.80, 8.11, -0.98, -0.16, 0.00]
  };

  const currentMixData = [
    { name: 'Domestic stock', value: 78.8, color: '#004a99' },
    { name: 'Foreign stock', value: 12.2, color: '#00a0d2' },
    { name: 'Bonds', value: 6.9, color: '#6ab023' },
    { name: 'Short term', value: 1.5, color: '#ffc20e' },
    { name: 'Other', value: 0.6, color: '#e57200' },
  ];

  const targetMixData = [
    { name: 'Domestic stock', value: 60, color: '#004a99' },
    { name: 'Foreign stock', value: 25, color: '#00a0d2' },
    { name: 'Bonds', value: 10, color: '#6ab023' },
    { name: 'Short term', value: 5, color: '#ffc20e' },
    { name: 'Other', value: 0, color: '#e57200' },
  ];

  const tableRows = [
    {
      name: 'ROTH IRA',
      number: 'XXXX0425',
      balance: 53306.28,
      pctOfGoal: '5.63%',
      domestic: '98.87%',
      foreign: '1.01%',
      bonds: '0%',
      shortTerm: '0.12%',
      other: '',
      unknown: ''
    },
    {
      name: 'LUKING y Individual TOD Account (MA)',
      number: 'XXXX2447',
      balance: 15.94,
      pctOfGoal: '0%',
      domestic: '13.8%',
      foreign: '5.89%',
      bonds: '74.53%',
      shortTerm: '5.77%',
      other: '0.01%',
      unknown: ''
    },
    {
      name: 'FIDELITY 401K SAVINGS',
      number: 'XXXX1234',
      balance: 456141.56,
      pctOfGoal: '48.24%',
      domestic: '58.11%',
      foreign: '26.66%',
      bonds: '14.29%',
      shortTerm: '0.88%',
      other: '0.07%',
      unknown: ''
    },
    {
      name: 'Luking\'s Fidelity Go (MA)',
      number: 'XXXX0562',
      balance: 157.48,
      pctOfGoal: '0.01%',
      domestic: '13.97%',
      foreign: '5.11%',
      bonds: '74.16%',
      shortTerm: '6.75%',
      other: '0.01%',
      unknown: ''
    },
    {
      name: 'UAL - TOD',
      number: 'XXXX7100',
      balance: 379853.69,
      pctOfGoal: '40.1%',
      domestic: '91.25%',
      foreign: '8.7%',
      bonds: '0%',
      shortTerm: '0.05%',
      other: '',
      unknown: ''
    },
    {
      name: 'SAVINGS',
      number: 'XXXX9922',
      balance: 55752.14,
      pctOfGoal: '5.9%',
      domestic: '91.31%',
      foreign: '8.64%',
      bonds: '0%',
      shortTerm: '0.05%',
      other: '',
      unknown: ''
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
                <div key={index} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-700 font-bold">{item.value}%</span>
                </div>
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
                                    {targetMixData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between text-[12px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-slate-600 font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-slate-700 font-bold">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex flex-col gap-3 w-full max-w-[280px]">
                                    <button className="bg-[#4d7c0f] hover:bg-[#3f6212] text-white font-bold py-2.5 px-8 rounded-full text-sm transition-all shadow-sm">
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
            <ul className="list-disc pl-5 space-y-4 text-xs text-slate-500 mb-12 max-w-4xl italic">
                <li>Diversification and asset allocation do not ensure a profit or guarantee against loss.</li>
                <li>At least one of the accounts assigned to your retirement plan is professionally managed.</li>
            </ul>

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
                    <div className="flex flex-wrap gap-4 mb-6 items-baseline">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Account labels</span>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {['(EC) Equity compensation', '(FV) Full View®', '(GB) Goal Booster', '(MA) Managed account', '(M) Manual', '(RE) Roth eligible'].map(label => (
                                <span key={label} className="text-[11px] text-slate-500 font-medium">{label}</span>
                            ))}
                        </div>
                    </div>

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
                                    {ASSET_CLASSES.map(ac => (
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
                                    {comparisonData.target.map((val, i) => (
                                        <td key={i} className="p-5 text-sm font-medium text-slate-700 border-r last:border-r-0 border-slate-200">{val}%</td>
                                    ))}
                                </tr>
                                <tr className="bg-[#f8fafc] border-b border-slate-200">
                                    <td className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200">Current</td>
                                    {comparisonData.current.map((val, i) => (
                                        <td key={i} className="p-5 text-sm font-medium text-slate-700 border-r last:border-r-0 border-slate-200">{val}%</td>
                                    ))}
                                </tr>
                                <tr className="bg-white">
                                    <td className="p-5 text-sm font-bold text-slate-700 border-r border-slate-200">Comparison</td>
                                    {comparisonData.comparison.map((val, i) => (
                                        <td key={i} className={`p-5 text-sm font-bold border-r last:border-r-0 border-slate-200 ${val < 0 ? 'text-slate-700' : 'text-slate-700'}`}>
                                            {val.toFixed(2)}%
                                        </td>
                                    ))}
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
                        <h3 className="text-lg font-bold text-slate-700 uppercase tracking-tight">Aggressive growth asset mix</h3>
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
                                                  formatter={(val: [number, number]) => val[0] < 0 ? `${val[0]}%` : ''} 
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
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationPage;