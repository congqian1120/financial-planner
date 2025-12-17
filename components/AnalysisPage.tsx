import React, { useState, useMemo } from 'react';
import Header from './Header';
import Controls from './Controls';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import SummaryFooter from './SummaryFooter';
import HouseholdSummary from './HouseholdSummary';
import GoalDetails from './GoalDetails';
import { ViewMode, ProjectionType, AppData } from '../types';
import { generateProjectionData, generateCashFlowData, CURRENT_YEAR, DEFAULT_CURRENT_AGE } from '../constants';

interface AnalysisPageProps {
  data: AppData;
  onNavigate: (step: number) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ data, onNavigate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [projectionType, setProjectionType] = useState<ProjectionType>(ProjectionType.ASSET_PROJECTION);

  const { household, retirement, accounts } = data;

  // Calculate dynamic data for charts
  const { projectionData, cashFlowData, retirementYear } = useMemo(() => {
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

    return { projectionData: projData, cashFlowData: flowData, retirementYear: retYear };
  }, [household.dob, retirement.retirementAge, retirement.planToAge, accounts]);

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
            />
          ) : (
            <TableSection projectionData={projectionData} />
          )}
        </div>

        <SummaryFooter projectionType={projectionType} projectionData={projectionData} />
        
        <HouseholdSummary data={data} />

        <GoalDetails data={data} onNavigate={onNavigate} />
      </main>
    </div>
  );
};

export default AnalysisPage;