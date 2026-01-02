import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Simulation Configuration
const NUM_TRIALS = 1000;

// Market assumptions for different strategies (Real Returns)
export const STRATEGY_MARKET_PARAMS: Record<string, { mean: number; vol: number }> = {
  'Short-term': { mean: 0.015, vol: 0.03 },
  'Conservative': { mean: 0.025, vol: 0.06 },
  'Moderate with income': { mean: 0.035, vol: 0.08 },
  'Moderate': { mean: 0.045, vol: 0.11 },
  'Balanced': { mean: 0.050, vol: 0.125 },
  'Growth with income': { mean: 0.055, vol: 0.14 },
  'Growth': { mean: 0.060, vol: 0.16 },
  'Aggressive growth': { mean: 0.065, vol: 0.18 },
  'Most aggressive': { mean: 0.072, vol: 0.22 },
};

/**
 * Box-Muller transform to generate a random number from a normal distribution
 * Mean = 0, StdDev = 1
 */
const gaussianRandom = () => {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const generateProjectionData = (
  currentAge: number, 
  retirementAge: number, 
  planToAge: number, 
  totalSaved: number, 
  annualContribution: number,
  meanReturn: number = 0.045, // Default to Moderate
  volatility: number = 0.11    // Default to Moderate
): ProjectionData[] => {
  const startYear = CURRENT_YEAR;
  const numYears = planToAge - currentAge;
  const retirementYearOffset = retirementAge - currentAge;

  // Initialize 1000 trials
  const trials: number[][] = Array.from({ length: NUM_TRIALS }, () => [totalSaved]);

  // Run the simulation year by year for all trials
  for (let yearIdx = 1; yearIdx <= numYears; yearIdx++) {
    for (let trialIdx = 0; trialIdx < NUM_TRIALS; trialIdx++) {
      const prevBalance = trials[trialIdx][yearIdx - 1];
      
      // Generate a random return for this year (Stochastic component)
      const randomReturn = meanReturn + (gaussianRandom() * volatility);
      
      // Accumulation vs Withdrawal phase
      const contribution = yearIdx <= retirementYearOffset ? annualContribution : 0;
      
      // Compounding: (Balance + Contribution) * (1 + r)
      const nextBalance = Math.max(0, (prevBalance + contribution) * (1 + randomReturn));
      trials[trialIdx].push(nextBalance);
    }
  }

  // Process the trials to find percentiles for each year
  const data: ProjectionData[] = [];
  for (let yearIdx = 0; yearIdx <= numYears; yearIdx++) {
    const yearBalances = trials.map(t => t[yearIdx]).sort((a, b) => a - b);
    
    data.push({
      year: startYear + yearIdx,
      // 50th Percentile (Median) -> Average Market
      average: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.50)]),
      // 25th Percentile -> Below Average Market
      belowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.25)]),
      // 5th Percentile -> Significantly Below Average Market
      significantlyBelowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.05)]),
    });
  }

  return data;
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
    const isEarlyPhase = year < (retirementYear + 7);
    const baseExpenses = isEarlyPhase ? 165000 : 155000;
    const expenses = baseExpenses + (Math.sin(year) * 2000);
    const fixedIncome = 45000; 
    
    let variableIncome = 0;
    if (isEarlyPhase) {
        variableIncome = 130000 + (Math.random() * 5000);
    } else {
        variableIncome = 120000 + (Math.random() * 10000);
    }

    data.push({
      year,
      expenses: Math.round(expenses),
      fixedIncome,
      variableIncome: Math.round(variableIncome)
    });
  }
  return data;
};

export const CHART_COLORS = {
  average: '#cbd5e1', 
  belowAverage: '#64748b', 
  sigBelowAverage: '#0f172a', 
};