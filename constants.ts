
import { ProjectionData, CashFlowData } from './types';

export const CURRENT_YEAR = 2025;
export const DEFAULT_CURRENT_AGE = 33;

// Inflation assumption (2.5% annual)
const INFLATION_RATE = 0.025;

// Nominal growth rates for different scenarios
const NOMINAL_AVG = 0.075;
const NOMINAL_BELOW = 0.055;
const NOMINAL_SIG_BELOW = 0.035;

/**
 * Fischer Equation for Real Returns: (1 + Nominal) / (1 + Inflation) - 1
 * This accurately reflects "Today's Dollars" (purchasing power).
 */
const RATE_AVG = (1 + NOMINAL_AVG) / (1 + INFLATION_RATE) - 1;
const RATE_BELOW = (1 + NOMINAL_BELOW) / (1 + INFLATION_RATE) - 1;
const RATE_SIG_BELOW = (1 + NOMINAL_SIG_BELOW) / (1 + INFLATION_RATE) - 1;

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
    // Contributions are assumed to stay constant in "Today's Dollars" 
    // (i.e., they increase with inflation in nominal terms to maintain value).
    if (year < retirementYear) {
        currentAvg = (currentAvg + annualContribution) * (1 + RATE_AVG);
        currentBelow = (currentBelow + annualContribution) * (1 + RATE_BELOW);
        currentSigBelow = (currentSigBelow + annualContribution) * (1 + RATE_SIG_BELOW);
    } else {
        // Post retirement (no contributions, growth only)
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
    // Early retirement often has higher spending (travel/hobbies)
    const isEarlyPhase = year < (retirementYear + 7);
    
    // Expenses in Today's Dollars (Real terms) - relatively flat
    const baseExpenses = isEarlyPhase ? 165000 : 155000;
    const expenses = baseExpenses + (Math.sin(year) * 2000); // Slight variation
    
    const fixedIncome = 45000; // Social Security / Pension in today's dollars
    
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
  average: '#cbd5e1', // Slate 300
  belowAverage: '#64748b', // Slate 500
  sigBelowAverage: '#0f172a', // Slate 900
};
