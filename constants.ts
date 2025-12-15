import { ProjectionData, CashFlowData } from './types';

export const RETIREMENT_YEAR = 2061;
export const START_YEAR = 2025;
export const END_YEAR = 2091;
export const INITIAL_ASSETS = 500000; // Starting with 500k
export const ANNUAL_CONTRIBUTION = 20000; // Adding 20k/year

// Growth rates for different scenarios
const RATE_AVG = 0.075;
const RATE_BELOW = 0.055;
const RATE_SIG_BELOW = 0.035;

export const generateProjectionData = (): ProjectionData[] => {
  const data: ProjectionData[] = [];
  let currentAvg = INITIAL_ASSETS;
  let currentBelow = INITIAL_ASSETS;
  let currentSigBelow = INITIAL_ASSETS;

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    data.push({
      year,
      average: Math.round(currentAvg),
      belowAverage: Math.round(currentBelow),
      significantlyBelowAverage: Math.round(currentSigBelow),
    });

    // Compound interest + contributions (simplified model)
    // Stop contributions after retirement year
    if (year < RETIREMENT_YEAR) {
        currentAvg = (currentAvg + ANNUAL_CONTRIBUTION) * (1 + RATE_AVG);
        currentBelow = (currentBelow + ANNUAL_CONTRIBUTION) * (1 + RATE_BELOW);
        currentSigBelow = (currentSigBelow + ANNUAL_CONTRIBUTION) * (1 + RATE_SIG_BELOW);
    } else {
        // Post retirement draw down or just growth without contribution?
        // The chart shows continued growth, implying investment returns > withdrawal or no withdrawal modeled
        currentAvg = currentAvg * (1 + RATE_AVG);
        currentBelow = currentBelow * (1 + RATE_BELOW);
        currentSigBelow = currentSigBelow * (1 + RATE_SIG_BELOW);
    }
  }
  return data;
};

export const PROJECTION_DATA = generateProjectionData();

export const generateCashFlowData = (): CashFlowData[] => {
  const data: CashFlowData[] = [];
  
  for (let year = RETIREMENT_YEAR; year <= END_YEAR; year++) {
    const isEarlyPhase = year < 2068;
    
    // Base values based on visual approximation of the screenshot
    const baseExpenses = isEarlyPhase ? 180000 : 300000;
    const expenses = baseExpenses + ((year - RETIREMENT_YEAR) * 1000) + (Math.sin(year) * 5000);
    
    const fixedIncome = 40000; // Yellow bar component
    
    // Variable income (Blue bar)
    let variableIncome = 0;
    if (isEarlyPhase) {
        variableIncome = 140000 + (Math.random() * 10000);
    } else {
        // Jumps up significantly then fluctuates/grows
        variableIncome = 320000 + ((year - 2068) * 5000) + (Math.random() * 40000 - 20000);
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

export const YEARLY_CASH_FLOW_DATA = generateCashFlowData();

export const CHART_COLORS = {
  average: '#cbd5e1', // Slate 300
  belowAverage: '#64748b', // Slate 500
  sigBelowAverage: '#0f172a', // Slate 900
};