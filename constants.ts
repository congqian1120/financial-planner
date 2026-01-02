import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Simulation Configuration
const NUM_TRIALS = 1000;

/** 
 * Market assumptions per asset class (Real Returns - Inflation Adjusted)
 * These are the building blocks for custom portfolio projections.
 */
export const ASSET_CLASS_MARKET_PARAMS: Record<string, { mean: number; vol: number }> = {
  domestic: { mean: 0.065, vol: 0.18 },  // High risk/return
  foreign: { mean: 0.070, vol: 0.21 },   // Higher risk
  bonds: { mean: 0.025, vol: 0.06 },     // Low risk/return
  shortTerm: { mean: 0.015, vol: 0.02 }, // Minimal risk
  other: { mean: 0.045, vol: 0.15 },     // Moderate
};

// Market assumptions for predefined strategies (for the "Modeled" comparison)
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
  meanReturn: number = 0.045, 
  volatility: number = 0.11
): ProjectionData[] => {
  const startYear = CURRENT_YEAR;
  const numYears = planToAge - currentAge;
  const retirementYearOffset = retirementAge - currentAge;

  const trials: number[][] = Array.from({ length: NUM_TRIALS }, () => [totalSaved]);

  for (let yearIdx = 1; yearIdx <= numYears; yearIdx++) {
    for (let trialIdx = 0; trialIdx < NUM_TRIALS; trialIdx++) {
      const prevBalance = trials[trialIdx][yearIdx - 1];
      const randomReturn = meanReturn + (gaussianRandom() * volatility);
      const contribution = yearIdx <= retirementYearOffset ? annualContribution : 0;
      const nextBalance = Math.max(0, (prevBalance + contribution) * (1 + randomReturn));
      trials[trialIdx].push(nextBalance);
    }
  }

  const data: ProjectionData[] = [];
  for (let yearIdx = 0; yearIdx <= numYears; yearIdx++) {
    const yearBalances = trials.map(t => t[yearIdx]).sort((a, b) => a - b);
    data.push({
      year: startYear + yearIdx,
      average: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.50)]),
      belowAverage: Math.round(yearBalances[Math.floor(NUM_TRIALS * 0.25)]),
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