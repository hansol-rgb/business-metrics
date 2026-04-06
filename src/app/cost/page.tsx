import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DataTable } from "@/components/dashboard/data-table";
import { CostClientBar } from "@/components/dashboard/cost-client-bar";
import { CostPackageBar } from "@/components/dashboard/cost-package-bar";
import { OperationCostBreakdown } from "@/components/dashboard/operation-cost-breakdown";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { formatKRW, formatKRWFull } from "@/lib/format";
import { MONTHS_KO, CLIENT_COLORS, PACKAGE_COLORS } from "@/lib/constants";
import type { MonthlyValues } from "@/types/pnl";

const monthKeys = [
  "m1", "m2", "m3", "m4", "m5", "m6",
  "m7", "m8", "m9", "m10", "m11", "m12",
] as const;

type MonthKey = (typeof monthKeys)[number];

function valuesCell(field: MonthKey | "ytd") {
  return (row: Record<string, unknown>) =>
    formatKRW((row.values as MonthlyValues)[field]);
}

function monthColumns() {
  return monthKeys.map((key, i) => ({
    key,
    header: MONTHS_KO[i],
    cell: valuesCell(key),
    align: "right" as const,
  }));
}

function ytdColumn(header = "YTD") {
  return {
    key: "ytd",
    header,
    cell: valuesCell("ytd"),
    align: "right" as const,
  };
}

export default async function CostPage() {
  const data = await getPNLData();

  const {
    costByClient,
    costByPackage,
    operationCosts,
    grandTotalCost,
    totalProjectCost,
    refOperationCost,
  } = data;

  const clientChartData = costByClient
    .map((c) => ({
      name: c.name,
      ytd: c.values.ytd,
      color: CLIENT_COLORS[c.name] ?? "#94A3B8",
    }))
    .sort((a, b) => b.ytd - a.ytd);

  const packageChartData = costByPackage
    .map((p) => ({
      name: p.name,
      ytd: p.values.ytd,
      color: PACKAGE_COLORS[p.name] ?? "#94A3B8",
    }))
    .sort((a, b) => b.ytd - a.ytd);

  const opByCategory = Object.fromEntries(
    operationCosts.map((c) => [c.category, c])
  );
  const opChartData = monthKeys.map((key, i) => ({
    month: MONTHS_KO[i],
    project: opByCategory["Project Operation"]?.values[key] ?? 0,
    product: opByCategory["Product Operation"]?.values[key] ?? 0,
    software: opByCategory["Software Subscription"]?.values[key] ?? 0,
  }));

  const clientColumns = [
    { key: "name", header: "고객" },
    ytdColumn(),
    ...monthColumns(),
  ];

  const packageColumns = [
    { key: "name", header: "패키지" },
    ytdColumn(),
    ...monthColumns(),
  ];

  const opColumns = [
    { key: "subcategory", header: "항목" },
    { key: "category", header: "카테고리" },
    ytdColumn(),
    ...monthColumns(),
  ];

  const sortedClients = [...costByClient].sort(
    (a, b) => b.values.ytd - a.values.ytd
  );
  const sortedPackages = [...costByPackage].sort(
    (a, b) => b.values.ytd - a.values.ytd
  );

  return (
    <div className="space-y-6">
      <Header title="비용" description="고객별, 패키지별, 운영비 상세" />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="총 비용 (YTD)"
          value={formatKRW(grandTotalCost.ytd)}
          subValue={formatKRWFull(grandTotalCost.ytd)}
        />
        <SummaryCard
          title="프로젝트 비용 (YTD)"
          value={formatKRW(totalProjectCost.ytd)}
          subValue={formatKRWFull(totalProjectCost.ytd)}
        />
        <SummaryCard
          title="운영비 (YTD)"
          value={formatKRW(refOperationCost.ytd)}
          subValue={formatKRWFull(refOperationCost.ytd)}
        />
      </div>

      <Tabs defaultValue="client">
        <TabsList>
          <TabsTrigger value="client">고객별</TabsTrigger>
          <TabsTrigger value="package">패키지별</TabsTrigger>
          <TabsTrigger value="operation">운영비</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-6">
          <CostClientBar data={clientChartData} />
          <DataTable
            columns={clientColumns}
            data={sortedClients as unknown as Record<string, unknown>[]}
            caption="고객별 비용 상세"
          />
        </TabsContent>

        <TabsContent value="package" className="space-y-6">
          <CostPackageBar data={packageChartData} />
          <DataTable
            columns={packageColumns}
            data={sortedPackages as unknown as Record<string, unknown>[]}
            caption="패키지별 비용 상세"
          />
        </TabsContent>

        <TabsContent value="operation" className="space-y-6">
          <OperationCostBreakdown data={opChartData} />
          <DataTable
            columns={opColumns}
            data={operationCosts as unknown as Record<string, unknown>[]}
            caption="운영비 상세"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
