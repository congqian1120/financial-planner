import React, { useState, useMemo } from 'react';
import Header from './Header';
import Controls from './Controls';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import SummaryFooter from './SummaryFooter';
import HouseholdSummary from './HouseholdSummary';
import GoalDetails from './GoalDetails';
import RetirementSavingsStrategy from './RetirementSavingsStrategy';
import AssetAllocationPage from './AssetAllocationPage';
import { ViewMode, ProjectionType, AppData } from '../types';
import { generateProjectionData, generateCashFlowData, CURRENT_YEAR, DEFAULT_CURRENT_AGE, STRATEGY_MARKET_PARAMS } from '../constants';

interface AnalysisPageProps {
  data: AppData;
  onNavigate: (step: number) => void;
  updateData: (updates: Partial<AppData>) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data, onNavigate, updateData }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [projectionType, setProjectionType] = useState<ProjectionType>(ProjectionType.ASSET_PROJECTION);
  const [showSavingsStrategy, setShowSavingsStrategy] = useState(false);
  const [showAssetAllocation, setShowAssetAllocation] = useState(false);

  const { household, retirement, accounts, modeledStrategy } = data;

  // Calculate dynamic data for charts using the Fischer Equation-based Real Returns
  const { projectionData, cashFlowData, retirementYear, summaryStats } = useMemo(() => {
    // Filter accounts: if not planning with partner, exclude accounts owned by "MONEY" (partner)
    const filteredAccounts = accounts.filter(acc => {
        const isRetirementGoal = acc.goal === 'RETIREMENT';
        if (!isRetirementGoal) return false;
        
        // If "Planning with partner" is OFF, exclude partner's accounts
        if (!household.planningWithPartner && acc.owner === 'MONEY') return false;
        
        return true;
    });

    const totalSaved = filteredAccounts.reduce((sum, a) => sum + a.value, 0);
    const totalContributions = filteredAccounts.reduce((sum, a) => sum + a.contributions, 0);

    const birthYear = new Date(household.dob).getFullYear();
    const currentAge = isNaN(birthYear) ? DEFAULT_CURRENT_AGE : (CURRENT_YEAR - birthYear);

    // Determine modeling parameters
    const strategy = modeledStrategy || 'Moderate';
    const params = STRATEGY_MARKET_PARAMS[strategy] || STRATEGY_MARKET_PARAMS['Moderate'];

    const projData = generateProjectionData(
      currentAge, 
      retirement.retirementAge, 
      retirement.planToAge, 
      totalSaved, 
      totalContributions,
      params.mean,
      params.vol
    );

    const flowData = generateCashFlowData(
      currentAge,
      retirement.retirementAge,
      retirement.planToAge
    );
    
    const retYear = CURRENT_YEAR + (retirement.retirementAge - currentAge);

    // Calculate dynamic monthly income estimates for the summary (Today's Dollars)
    const finalYearData = projData[projData.length - 1];
    const avgMonthlyIncome = Math.round((finalYearData.average * 0.04) / 12);
    const belowAvgMonthlyIncome = Math.round((finalYearData.belowAverage * 0.04) / 12);
    const sigBelowAvgMonthlyIncome = Math.round((finalYearData.significantlyBelowAverage * 0.04) / 12);
    
    // Adjust "Monthly Need": If planning solo, assume expenses are 65% of the joint household expense
    let monthlyNeed = data.expenses.essential + data.expenses.nonEssential;
    if (!household.planningWithPartner) {
        monthlyNeed = Math.round(monthlyNeed * 0.65);
    }

    return { 
      projectionData: projData, 
      cashFlowData: flowData, 
      retirementYear: retYear,
      summaryStats: {
        avgMonthlyIncome,
        belowAvgMonthlyIncome,
        sigBelowAvgMonthlyIncome,
        monthlyNeed
      }
    };
  }, [data, accounts, household.dob, household.planningWithPartner, retirement.retirementAge, retirement.planToAge, modeledStrategy]);

  const handleResetModeling = () => {
    updateData({ modeledStrategy: null });
  };

  if (showSavingsStrategy) {
    return <RetirementSavingsStrategy data={data} onBack={() => setShowSavingsStrategy(false)} onNavigate={onNavigate} />;
  }

  if (showAssetAllocation) {
    return <AssetAllocationPage data={data} updateData={updateData} onBack={() => setShowAssetAllocation(false)} onNavigate={onNavigate} />;
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {modeledStrategy && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-sm flex justify-between items-center shadow-sm">
           <div className="text-sm text-blue-800">
             <span className="font-bold">Modeling Active:</span> Showing projections for <span className="font-bold">{modeledStrategy}</span> strategy. This is a temporary showcase.
           </div>
           <button 
            onClick={handleResetModeling}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2"
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
        />
        
        <div className="mt-6 mb-8">
          {viewMode === ViewMode.CHART ? (
            <ChartSection 
              projectionType={projectionType} 
              projectionData={projectionData}
              cashFlowData={cashFlowData}
              retirementYear={retirementYear}
              summaryStats={summaryStats}
            />
          ) : (
            <TableSection projectionData={projectionData} />
          )}
        </div>

        <SummaryFooter projectionType={projectionType} projectionData={projectionData} />
        
        <HouseholdSummary data={data} summaryStats={summaryStats} />

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