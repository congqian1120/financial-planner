
import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Inflation assumption (2.5% annual)
const INFLATION_RATE = 0.025;

// Nominal growth rates for different scenarios
const NOMINAL_AVG = 0.075;
const NOMINAL_BELOW = 0.055;
const NOMINAL_SIG_BELOW = 0.035;

// Real growth rates (Nominal - Inflation) to reflect "Today's Dollars"
const RATE_AVG = NOMINAL_AVG - INFLATION_RATE;         // 5.0% real return
const RATE_BELOW = NOMINAL_BELOW - INFLATION_RATE;     // 3.0% real return
const RATE_SIG_BELOW = NOMINAL_SIG_BELOW - INFLATION_RATE; // 1.0% real return

export const generateProjectionData = (
  currentAge: number, 
  retirementAge: number, 
  planToAge: number, 
  totalSaved: number, 
  annualContribution: number
): ProjectionData[] => {
  const startYear = CURRENT_YEAR;
  const endYear = startYear + (planToAge - currentAge);
  const retirementYear = startYear + (retirementAge - currentAge);

  const data: ProjectionData[] = [];
  let currentAvg = totalSaved;
  let currentBelow = totalSaved;
  let currentSigBelow = totalSaved;

  for (let year = startYear; year <= endYear; year++) {
    data.push({
      year,
      average: Math.round(currentAvg),
      belowAverage: Math.round(currentBelow),
      significantlyBelowAverage: Math.round(currentSigBelow),
    });

    // Compounding with real rates. 
    // Contributions are assumed to stay constant in "Today's Dollars" (increasing with inflation in nominal terms).
    if (year < retirementYear) {
        currentAvg = (currentAvg + annualContribution) * (1 + RATE_AVG);
        currentBelow = (currentBelow + annualContribution) * (1 + RATE_BELOW);
        currentSigBelow = (currentSigBelow + annualContribution) * (1 + RATE_SIG_BELOW);
    } else {
        // Post retirement (no contributions)
        currentAvg = currentAvg * (1 + RATE_AVG);
        currentBelow = currentBelow * (1 + RATE_BELOW);
        currentSigBelow = currentSigBelow * (1 + RATE_SIG_BELOW);
    }
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
    const baseExpenses = isEarlyPhase ? 180000 : 300000;
    const expenses = baseExpenses + ((year - retirementYear) * 1000) + (Math.sin(year) * 5000);
    const fixedIncome = 40000;
    
    let variableIncome = 0;
    if (isEarlyPhase) {
        variableIncome = 140000 + (Math.random() * 10000);
    } else {
        variableIncome = 320000 + ((year - (retirementYear + 7)) * 5000) + (Math.random() * 40000 - 20000);
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
  average: '#cbd5e1', // Slate 300
  belowAverage: '#64748b', // Slate 500
  sigBelowAverage: '#0f172a', // Slate 900
};
