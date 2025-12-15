import React, { useState } from 'react';
import Header from './Header';
import Controls from './Controls';
import ChartSection from './ChartSection';
import TableSection from './TableSection';
import SummaryFooter from './SummaryFooter';
import HouseholdSummary from './HouseholdSummary';
import GoalDetails from './GoalDetails';
import { ViewMode, ProjectionType } from '../types';

const AnalysisPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHART);
  const [projectionType, setProjectionType] = useState<ProjectionType>(ProjectionType.ASSET_PROJECTION);

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
            <ChartSection projectionType={projectionType} />
          ) : (
            <TableSection />
          )}
        </div>

        <SummaryFooter projectionType={projectionType} />
        
        <HouseholdSummary />

        <GoalDetails />
      </main>
    </div>
  );
};

export default AnalysisPage;