
import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Simulation Configuration
// 5,000 trials provides high confidence for the 5th percentile (Significantly Below Average) outcome.
const NUM_TRIALS = 5000;

export interface SimulationResult {
  projectionData: ProjectionData[];
  probabilityOfSuccess: number;
}

/** 
 * Market assumptions per asset class (Real Returns - Inflation Adjusted)
 * These are long-term historical real returns (Gross of fees).
 */
export const ASSET_CLASS_MARKET_PARAMS: Record<string, { mean: number; volatility: number }> = {
  domestic: { mean: 0.065, volatility: 0.18 },
  foreign: { mean: 0.070, volatility: 0.21 },
  bonds: { mean: 0.025, volatility: 0.06 },
  shortTerm: { mean: 0.015, volatility: 0.02 },
  other: { mean: 0.045, volatility: 0.15 },
};

// Market assumptions for predefined strategies
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
 * Retirement Projection Engine
 * Calculates portfolio balance year-over-year across 5000 potential market paths.
 */
export const fetchProjectionResult = async (
  currentAge: number, 
  retirementAge: number, 
  planToAge: number, 
  totalSaved: number, 
  annualContribution: number,
  params: { mean: number; volatility: number },
  monthlyExpenses: number,
  annualFixedIncome: number = 0
): Promise<SimulationResult> => {
  // Simulate network/processing latency
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
      
      // Calculate real return for this year in this trial
      const randomReturn = params.mean + (gaussianRandom() * params.volatility);
      
      // SALARY LOGIC: Contributions only happen while working (up to retirement age)
      const contribution = yearIdx <= retirementYearOffset ? annualContribution : 0;
      
      // WITHDRAWAL LOGIC: Expenses start after retirement
      const annualExpenses = monthlyExpenses * 12;
      const netAnnualWithdrawal = Math.max(0, annualExpenses - annualFixedIncome);
      const withdrawal = yearIdx > retirementYearOffset ? netAnnualWithdrawal : 0;
      
      // Math: (Previous Balance + New Savings - Living Costs) * Market Performance
      const nextBalance = Math.max(0, (prevBalance + contribution - withdrawal) * (1 + randomReturn));
      trials[trialIdx].push(nextBalance);

      if (nextBalance <= 0) {
        failed = true;
      }
    }
    // Success means the portfolio never hit zero during the plan duration
    if (!failed && trials[trialIdx][numYears] > 0) {
      successCount++;
    }
  }

  const projectionData: ProjectionData[] = [];
  for (let yearIdx = 0; yearIdx <= numYears; yearIdx++) {
    const yearBalances = trials.map(t => t[yearIdx]).sort((a, b) => a - b);
    projectionData.push({
      year: startYear + yearIdx,
      // Median (50th percentile)
      average: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.50)]),
      // Below Average (25th percentile)
      belowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.25)]),
      // Significantly Below Average (5th percentile - The Stress Test)
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
      variableIncome: 115000 // Reflecting the withdrawal gap
    });
  }
  return data;
};

export const CHART_COLORS = {
  average: '#cbd5e1', 
  belowAverage: '#64748b', 
  sigBelowAverage: '#0f172a', 
};
