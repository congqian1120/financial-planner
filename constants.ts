
import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Simulation Configuration
const NUM_TRIALS = 1000;

export interface SimulationResult {
  projectionData: ProjectionData[];
  probabilityOfSuccess: number;
}

/** 
 * Market assumptions per asset class (Real Returns - Inflation Adjusted)
 */
// Fix: renamed 'vol' to 'volatility' to align with the fetchProjectionResult parameters
export const ASSET_CLASS_MARKET_PARAMS: Record<string, { mean: number; volatility: number }> = {
  domestic: { mean: 0.065, volatility: 0.18 },
  foreign: { mean: 0.070, volatility: 0.21 },
  bonds: { mean: 0.025, volatility: 0.06 },
  shortTerm: { mean: 0.015, volatility: 0.02 },
  other: { mean: 0.045, volatility: 0.15 },
};

// Market assumptions for predefined strategies
// Fix: renamed 'vol' to 'volatility' to align with the fetchProjectionResult parameters
export const STRATEGY_MARKET_PARAMS: Record<string, { mean: number; volatility: number }> = {
  'Short-term': { mean: 0.015, volatility: 0.03 },
  'Conservative': { mean: 0.025, volatility: 0.06 },
  'Moderate with income': { mean: 0.035, volatility: 0.08 },
  'Moderate': { mean: 0.045, volatility: 0.11 },
  'Balanced': { mean: 0.050, volatility: 0.125 },
  'Growth with income': { mean: 0.055, volatility: 0.14 },
  'Growth': { mean: 0.060, volatility: 0.16 },
  'Aggressive growth': { mean: 0.065, volatility: 0.18 },
  'Most aggressive': { mean: 0.072, volatility: 0.22 },
};

const gaussianRandom = () => {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

/**
 * MOCK API CALL: This simulates a backend projection engine.
 * In a real app, replace the internals with a fetch() call.
 */
export const fetchProjectionResult = async (
  currentAge: number, 
  retirementAge: number, 
  planToAge: number, 
  totalSaved: number, 
  annualContribution: number,
  params: { mean: number; volatility: number },
  monthlyExpenses: number // Needed for failure detection
): Promise<SimulationResult> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));

  const startYear = CURRENT_YEAR;
  const numYears = planToAge - currentAge;
  const retirementYearOffset = retirementAge - currentAge;

  const trials: number[][] = Array.from({ length: NUM_TRIALS }, () => [totalSaved]);
  let successCount = 0;

  for (let trialIdx = 0; trialIdx < NUM_TRIALS; trialIdx++) {
    let failed = false;
    for (let yearIdx = 1; yearIdx <= numYears; yearIdx++) {
      const prevBalance = trials[trialIdx][yearIdx - 1];
      const randomReturn = params.mean + (gaussianRandom() * params.volatility);
      
      const contribution = yearIdx <= retirementYearOffset ? annualContribution : 0;
      const withdrawal = yearIdx > retirementYearOffset ? (monthlyExpenses * 12) : 0;
      
      const nextBalance = Math.max(0, (prevBalance + contribution - withdrawal) * (1 + randomReturn));
      trials[trialIdx].push(nextBalance);

      if (nextBalance <= 0) failed = true;
    }
    if (!failed) successCount++;
  }

  const projectionData: ProjectionData[] = [];
  for (let yearIdx = 0; yearIdx <= numYears; yearIdx++) {
    const yearBalances = trials.map(t => t[yearIdx]).sort((a, b) => a - b);
    projectionData.push({
      year: startYear + yearIdx,
      average: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.50)]),
      belowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.25)]),
      significantlyBelowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.05)]),
    });
  }

  return {
    projectionData,
    probabilityOfSuccess: Math.round((successCount / NUM_TRIALS) * 100)
  };
};

export const generateCashFlowData = (
  currentAge: number,
  retirementAge: number,
  planToAge: number
): CashFlowData[] => {
  const startYear = CURRENT_YEAR;
  const retirementYear = startYear + (retirementAge - currentAge);
  const endYear = startYear + (planToAge - currentAge);
  const data: CashFlowData[] = [];
  for (let year = retirementYear; year <= endYear; year++) {
    data.push({
      year,
      expenses: 160000,
      fixedIncome: 45000, 
      variableIncome: 125000
    });
  }
  return data;
};

export const CHART_COLORS = {
  average: '#cbd5e1', 
  belowAverage: '#64748b', 
  sigBelowAverage: '#0f172a', 
};
