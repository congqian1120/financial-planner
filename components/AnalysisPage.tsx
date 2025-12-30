
import React, { useState, useMemo } from 'react';
import Header from './Header';
import Controls from './Controls';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import SummaryFooter from './SummaryFooter';
import HouseholdSummary from './HouseholdSummary';
import GoalDetails from './GoalDetails';
import RetirementSavingsStrategy from './RetirementSavingsStrategy';
import { ViewMode, ProjectionType, AppData } from '../types';
import { generateProjectionData, generateCashFlowData, CURRENT_YEAR, DEFAULT_CURRENT_AGE } from '../constants';

interface AnalysisPageProps {
  data: AppData;
  onNavigate: (step: number) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data, onNavigate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [projectionType, setProjectionType] = useState<ProjectionType>(ProjectionType.ASSET_PROJECTION);
  const [showSavingsStrategy, setShowSavingsStrategy] = useState(false);

  const { household, retirement, accounts } = data;

  // Calculate dynamic data for charts using the Fischer Equation-based Real Returns
  const { projectionData, cashFlowData, retirementYear, summaryStats } = useMemo(() => {
    const totalSaved = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.value, 0);
    const totalContributions = accounts.filter(a => a.goal === 'RETIREMENT').reduce((sum, a) => sum + a.contributions, 0);

    const birthYear = new Date(household.dob).getFullYear();
    const currentAge = isNaN(birthYear) ? DEFAULT_CURRENT_AGE : (CURRENT_YEAR - birthYear);

    const projData = generateProjectionData(
      currentAge, 
      retirement.retirementAge, 
      retirement.planToAge, 
      totalSaved, 
      totalContributions
    );

    const flowData = generateCashFlowData(
      currentAge,
      retirement.retirementAge,
      retirement.planToAge
    );
    
    const retYear = CURRENT_YEAR + (retirement.retirementAge - currentAge);

    // Calculate dynamic monthly income estimates for the summary (Today's Dollars)
    // Using a safe withdrawal rate of 4% for "Estimated Income"
    const finalYearData = projData[projData.length - 1];
    const avgMonthlyIncome = Math.round((finalYearData.average * 0.04) / 12);
    const belowAvgMonthlyIncome = Math.round((finalYearData.belowAverage * 0.04) / 12);
    const sigBelowAvgMonthlyIncome = Math.round((finalYearData.significantlyBelowAverage * 0.04) / 12);
    
    // Estimate need from current expenses state
    const monthlyNeed = data.expenses.essential + data.expenses.nonEssential;

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
  }, [data, accounts, household.dob, retirement.retirementAge, retirement.planToAge]);

  if (showSavingsStrategy) {
    return <RetirementSavingsStrategy data={data} onBack={() => setShowSavingsStrategy(false)} onNavigate={onNavigate} />;
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
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
        />
      </main>
    </div>
  );
};

export default AnalysisPage;
