import type {
  MonthlyValues,
  PNLData,
  ClientRevenue,
  PackageRevenue,
  SalesAccount,
  ResourceData,
  ClientCost,
  PackageCost,
  OperationCost,
} from '@/types/pnl';

function parseNumber(raw: string): number {
  if (!raw || raw.trim() === '') return 0;
  const cleaned = raw.trim().replace(/%$/, '').replace(/,/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function parseRow(cells: string[]): MonthlyValues {
  return {
    ytd: parseNumber(cells[3] ?? ''),
    ytdProjection: parseNumber(cells[4] ?? ''),
    m1: parseNumber(cells[5] ?? ''),
    m2: parseNumber(cells[6] ?? ''),
    m3: parseNumber(cells[7] ?? ''),
    m4: parseNumber(cells[8] ?? ''),
    m5: parseNumber(cells[9] ?? ''),
    m6: parseNumber(cells[10] ?? ''),
    m7: parseNumber(cells[11] ?? ''),
    m8: parseNumber(cells[12] ?? ''),
    m9: parseNumber(cells[13] ?? ''),
    m10: parseNumber(cells[14] ?? ''),
    m11: parseNumber(cells[15] ?? ''),
    m12: parseNumber(cells[16] ?? ''),
  };
}

export function parsePNLFromRows(rows: string[][]): PNLData {
  // 1-based row indices: row N in CSV = rows[N-1]
  const r = (n: number) => rows[n - 1] ?? [];

  const summary = {
    totalRevenue: parseRow(r(2)),
    operationCost: parseRow(r(3)),
    contributionMargin: parseRow(r(5)),
    contributionMarginPct: parseRow(r(6)),
    revenueGoal: parseRow(r(8)),
    diff: parseRow(r(9)),
    diffPct: parseRow(r(10)),
    cmPerHour: parseRow(r(11)),
  };

  const clientNames = [
    'Monday', 'Databricks', 'Ralph Lauren', 'Samsung', 'Merck',
    'Omnicon', 'Adobe APAC', 'Adobe KR', 'Loreal', 'Nike', 'Dongsuh', 'Salesforce',
  ];
  const revenueByClient: ClientRevenue[] = clientNames.map((name, i) => ({
    name,
    values: parseRow(r(15 + i)),
  }));

  const packageNames = ['Consulting', 'Retainer', 'Tech Audit', 'VIVI'];
  const revenueByPackage: PackageRevenue[] = packageNames.map((name, i) => ({
    name,
    values: parseRow(r(30 + i)),
  }));

  const salesAccounts: SalesAccount[] = packageNames.map((name, i) => ({
    name,
    values: parseRow(r(37 + i)),
  }));

  const resources: ResourceData = {
    totalHours: parseRow(r(43)),
    cmPerHour: parseRow(r(44)),
    fulltimeHead: parseRow(r(45)),
    fulltimeHours: parseRow(r(46)),
    freelancerHours: parseRow(r(47)),
  };

  const costClientNames = [
    'Monday', 'Databricks', 'Ralph Lauren', 'Gitlab', 'Samsung', 'Merck',
    'Omnicon', 'Adobe APAC', 'Adobe KR', 'Loreal', 'Nike', 'Dongsuh', 'Salesforce', 'VIVI',
  ];
  const costByClient: ClientCost[] = costClientNames.map((name, i) => ({
    name,
    values: parseRow(r(53 + i)),
  }));

  const costByPackage: PackageCost[] = packageNames.map((name, i) => ({
    name,
    values: parseRow(r(70 + i)),
  }));

  const operationCosts: OperationCost[] = [
    {
      category: 'Operation cost',
      subcategory: (r(76)[2] ?? '').trim() || 'Project Operation(tool, outsourcing etc.)',
      values: parseRow(r(76)),
    },
    {
      category: 'Operation cost',
      subcategory: (r(77)[2] ?? '').trim() || 'Product Operation(tool, outsourcing etc.)',
      values: parseRow(r(77)),
    },
    {
      category: 'Operation cost',
      subcategory: (r(78)[2] ?? '').trim() || 'Software Subsrcription + Purchase',
      values: parseRow(r(78)),
    },
  ];

  return {
    summary,
    revenueByClient,
    revenueByPackage,
    salesAccounts,
    resources,
    costByClient,
    costByPackage,
    operationCosts,
    grandTotalCost: parseRow(r(51)),
    totalProjectCost: parseRow(r(52)),
    refOperationCost: parseRow(r(75)),
  };
}
