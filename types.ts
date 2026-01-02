export interface ProjectionData {
  year: number;
  average: number;
  belowAverage: number;
  significantlyBelowAverage: number;
}

export interface CashFlowData {
  year: number;
  expenses: number;
  fixedIncome: number;
  variableIncome: number;
}

export enum ViewMode {
  CHART = 'Chart',
  TABLE = 'Table'
}

export enum ProjectionType {
  ASSET_PROJECTION = 'Asset projection',
  MONTHLY_CASH_FLOW = 'Monthly cash flow in retirement',
  YEARLY_CASH_FLOW = 'Yearly cash flow in retirement'
}

export interface AssetBreakdown {
  domestic: number; // Percentage 0-100
  foreign: number;
  bonds: number;
  shortTerm: number;
  other: number;
}

export interface Account {
  id: number;
  name: string;
  number: string;
  goal: string;
  type: string;
  owner: string;
  value: number;
  contributions: number;
  isOutside?: boolean;
  assetBreakdown?: AssetBreakdown;
}

export interface AppData {
  household: {
    name: string;
    dob: string;
    income: number;
    bonus: number;
    partnerName: string;
    partnerDob: string;
    partnerIncome: number;
    partnerBonus: number;
    planningWithPartner: boolean;
  };
  retirement: {
    retirementAge: number;
    partnerRetirementAge: number;
    planToAge: number;
    state: string;
  };
  expenses: {
    method: 'basic' | 'monthly' | 'detailed';
    lifestyle: 'above' | 'average' | 'below';
    essential: number;
    nonEssential: number;
    detailed: Record<string, number>;
  };
  accounts: Account[];
  income: {
    socialSecurity: {
        amount: number;
        startAge: number;
        enabled: boolean;
    };
    pension: number;
    annuity: number;
    other: number;
    oneTime: number;
  };
  modeledStrategy?: string | null;
}