import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Controls from './Controls';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import SummaryFooter from './SummaryFooter';
import HouseholdSummary from './HouseholdSummary';
import GoalDetails from './GoalDetails';
import RetirementSavingsStrategy from './RetirementSavingsStrategy';
import AssetAllocationPage from './AssetAllocationPage';
import { ViewMode, ProjectionType, AppData, ProjectionData, CashFlowData } from '../types';
import { fetchProjectionResult, generateCashFlowData, CURRENT_YEAR, DEFAULT_CURRENT_AGE, STRATEGY_MARKET_PARAMS, ASSET_CLASS_MARKET_PARAMS } from '../constants';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface AnalysisPageProps {
  data: AppData;
  onNavigate: (step: number) => void;
  updateData: (updates: Partial<AppData>) => void;
}

interface AnalysisState {
    projectionData: ProjectionData[];
    cashFlowData: CashFlowData[];
    retirementYear: number;
    successProbability: number;
    isLoading: boolean;
    error: string | null;
    summaryStats: {
        avgMonthlyIncome: number;
        belowAvgMonthlyIncome: number;
        sigBelowAvgMonthlyIncome: number;
        monthlyNeed: number;
    };
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data, onNavigate, updateData }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [projectionType, setProjectionType] = useState<ProjectionType>(ProjectionType.ASSET_PROJECTION);
  const [showSavingsStrategy, setShowSavingsStrategy] = useState(false);
  const [showAssetAllocation, setShowAssetAllocation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const [analysis, setAnalysis] = useState<AnalysisState>({
      projectionData: [],
      cashFlowData: [],
      retirementYear: CURRENT_YEAR,
      successProbability: 0,
      isLoading: true,
      error: null,
      summaryStats: { avgMonthlyIncome: 0, belowAvgMonthlyIncome: 0, sigBelowAvgMonthlyIncome: 0, monthlyNeed: 0 }
  });

  const { household, retirement, accounts, modeledStrategy } = data;
  const analysisTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const runAnalysis = async () => {
        if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);

        analysisTimeoutRef.current = window.setTimeout(async () => {
            setAnalysis(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const filteredAccounts = accounts.filter(acc => {
                    const isRetirementGoal = acc.goal === 'RETIREMENT';
                    if (!isRetirementGoal) return false;
                    if (!household.planningWithPartner && acc.owner === 'MONEY') return false;
                    return true;
                });

                const totalSaved = filteredAccounts.reduce((sum, a) => sum + a.value, 0);
                const totalContributions = filteredAccounts.reduce((sum, a) => sum + a.contributions, 0);

                let customMean = 0, customVol = 0;
                if (totalSaved > 0) {
                    let weightedMean = 0, weightedVol = 0;
                    filteredAccounts.forEach(acc => {
                        const weight = acc.value / totalSaved;
                        const b = acc.assetBreakdown || { domestic: 0, foreign: 0, bonds: 0, shortTerm: 100, other: 0 };
                        weightedMean += ((b.domestic/100) * ASSET_CLASS_MARKET_PARAMS.domestic.mean + (b.foreign/100) * ASSET_CLASS_MARKET_PARAMS.foreign.mean + (b.bonds/100) * ASSET_CLASS_MARKET_PARAMS.bonds.mean + (b.shortTerm/100) * ASSET_CLASS_MARKET_PARAMS.shortTerm.mean + (b.other/100) * ASSET_CLASS_MARKET_PARAMS.other.mean) * weight;
                        weightedVol += ((b.domestic/100) * ASSET_CLASS_MARKET_PARAMS.domestic.volatility + (b.foreign/100) * ASSET_CLASS_MARKET_PARAMS.foreign.volatility + (b.bonds/100) * ASSET_CLASS_MARKET_PARAMS.bonds.volatility + (b.shortTerm/100) * ASSET_CLASS_MARKET_PARAMS.shortTerm.volatility + (b.other/100) * ASSET_CLASS_MARKET_PARAMS.other.volatility) * weight;
                    });
                    customMean = weightedMean;
                    customVol = weightedVol;
                }

                const params = modeledStrategy 
                    ? (STRATEGY_MARKET_PARAMS[modeledStrategy] || STRATEGY_MARKET_PARAMS['Moderate'])
                    : { mean: customMean || 0.045, volatility: customVol || 0.11 };

                const birthYear = new Date(household.dob).getFullYear();
                const currentAge = isNaN(birthYear) ? DEFAULT_CURRENT_AGE : (CURRENT_YEAR - birthYear);
                
                let monthlyNeed = data.expenses.essential + data.expenses.nonEssential;
                if (!household.planningWithPartner) monthlyNeed = Math.round(monthlyNeed * 0.65);

                const result = await fetchProjectionResult(
                    currentAge, 
                    retirement.retirementAge, 
                    retirement.planToAge, 
                    totalSaved, 
                    totalContributions,
                    params,
                    monthlyNeed
                );

                if (!isMounted) return;

                const flowData = generateCashFlowData(currentAge, retirement.retirementAge, retirement.planToAge);
                const retYear = CURRENT_YEAR + (retirement.retirementAge - currentAge);
                const finalYearData = result.projectionData[result.projectionData.length - 1];

                setAnalysis({
                    projectionData: result.projectionData,
                    cashFlowData: flowData,
                    retirementYear: retYear,
                    successProbability: result.probabilityOfSuccess,
                    isLoading: false,
                    error: null,
                    summaryStats: {
                        avgMonthlyIncome: Math.round((finalYearData.average * 0.04) / 12),
                        belowAvgMonthlyIncome: Math.round((finalYearData.belowAverage * 0.04) / 12),
                        sigBelowAvgMonthlyIncome: Math.round((finalYearData.significantlyBelowAverage * 0.04) / 12),
                        monthlyNeed
                    }
                });
            } catch (err) {
                if (isMounted) {
                    setAnalysis(prev => ({ ...prev, isLoading: false, error: "Failed to update analysis. Please check your connection." }));
                }
            }
        }, 300);
    };

    runAnalysis();
    return () => { 
        isMounted = false;
        if (analysisTimeoutRef.current) window.clearTimeout(analysisTimeoutRef.current);
    };
  }, [data, accounts, household.dob, household.planningWithPartner, retirement.retirementAge, retirement.planToAge, modeledStrategy, retryCount]);

  const handleResetModeling = () => {
    updateData({ modeledStrategy: null });
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (showSavingsStrategy) {
    return <RetirementSavingsStrategy data={data} onBack={() => setShowSavingsStrategy(false)} onNavigate={onNavigate} />;
  }

  if (showAssetAllocation) {
    return <AssetAllocationPage data={data} updateData={updateData} onBack={() => setShowAssetAllocation(false)} onNavigate={onNavigate} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {modeledStrategy && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
           <div className="text-sm text-blue-800">
             <span className="font-bold">Modeling Active:</span> Showing projections for <span className="font-bold">{modeledStrategy}</span> strategy.
           </div>
           <button 
            onClick={handleResetModeling}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 shrink-0"
           >
             Reset to current mix
           </button>
        </div>
      )}

      <Header />
      
      <main className="bg-white">
        <Controls 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          projectionType={projectionType}
          setProjectionType={setProjectionType}
          activeStrategyName={modeledStrategy}
        />
        
        <div className="mt-4 md:mt-6 mb-8 relative min-h-[500px] md:min-h-[550px] lg:min-h-[600px]">
          {analysis.isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-sm">
                  <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-green-700 rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Updating</span>
                  </div>
              </div>
          )}

          {analysis.error && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white rounded-sm border border-red-100">
                  <div className="flex flex-col items-center gap-4 p-8 text-center">
                      <AlertCircle className="text-red-500 w-12 h-12" />
                      <div className="text-slate-800 font-bold">{analysis.error}</div>
                      <button 
                        onClick={handleRetry}
                        className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-900 transition-colors"
                      >
                          <RefreshCcw size={14} /> Retry
                      </button>
                  </div>
              </div>
          )}
          
          {viewMode === ViewMode.CHART ? (
            <ChartSection 
              projectionType={projectionType} 
              projectionData={analysis.projectionData}
              cashFlowData={analysis.cashFlowData}
              retirementYear={analysis.retirementYear}
              summaryStats={analysis.summaryStats}
            />
          ) : (
            <TableSection projectionData={analysis.projectionData} />
          )}
        </div>

        <SummaryFooter projectionType={projectionType} projectionData={analysis.projectionData} />
        
        <HouseholdSummary 
            data={data} 
            summaryStats={analysis.summaryStats} 
            probabilityOfSuccess={analysis.successProbability} 
        />

        <GoalDetails 
          data={data} 
          onNavigate={onNavigate} 
          onExploreSavings={() => setShowSavingsStrategy(true)} 
          onViewAssetAllocation={() => setShowAssetAllocation(true)}
        />
      </main>
    </div>
  );
};

export default AnalysisPage;