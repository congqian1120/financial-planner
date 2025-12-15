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