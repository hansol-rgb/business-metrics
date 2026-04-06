export interface MonthlyValues {
  ytd: number;
  ytdProjection: number;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
  m7: number;
  m8: number;
  m9: number;
  m10: number;
  m11: number;
  m12: number;
}

export interface SummaryData {
  totalRevenue: MonthlyValues;
  operationCost: MonthlyValues;
  contributionMargin: MonthlyValues;
  contributionMarginPct: MonthlyValues;
  revenueGoal: MonthlyValues;
  diff: MonthlyValues;
  diffPct: MonthlyValues;
  cmPerHour: MonthlyValues;
}

export interface ClientRevenue {
  name: string;
  values: MonthlyValues;
}

export interface PackageRevenue {
  name: string;
  values: MonthlyValues;
}

export interface SalesAccount {
  name: string;
  values: MonthlyValues;
}

export interface ResourceData {
  totalHours: MonthlyValues;
  cmPerHour: MonthlyValues;
  fulltimeHead: MonthlyValues;
  fulltimeHours: MonthlyValues;
  freelancerHours: MonthlyValues;
}

export interface ClientCost {
  name: string;
  values: MonthlyValues;
}

export interface PackageCost {
  name: string;
  values: MonthlyValues;
}

export interface OperationCost {
  category: string;
  subcategory: string;
  values: MonthlyValues;
}

export interface PNLData {
  summary: SummaryData;
  revenueByClient: ClientRevenue[];
  revenueByPackage: PackageRevenue[];
  salesAccounts: SalesAccount[];
  resources: ResourceData;
  costByClient: ClientCost[];
  costByPackage: PackageCost[];
  operationCosts: OperationCost[];
  grandTotalCost: MonthlyValues;
  totalProjectCost: MonthlyValues;
  refOperationCost: MonthlyValues;
}
