
import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Simulation Configuration
const NUM_TRIALS = 1000;
const INFLATION_RATE = 0.025;

// Moderate Asset Mix Assumptions (Real Returns)
// Mean: ~4.5% real, Std Dev: ~11% (Typical for a 60/40 or 70/30 portfolio)
const MEAN_REAL_RETURN = 0.045; 
const VOLATILITY = 0.11;

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
  annualContribution: number
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
      const randomReturn = MEAN_REAL_RETURN + (gaussianRandom() * VOLATILITY);
      
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
