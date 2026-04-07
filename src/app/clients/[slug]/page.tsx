import { notFound } from "next/navigation";
import { getPNLData } from "@/lib/data";
import { deslugify } from "@/lib/slugify";
import { formatKRW, formatPercent } from "@/lib/format";
import { MONTHS_KO, CLIENT_COLORS, FALLBACK_COLOR } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DataTable } from "@/components/dashboard/data-table";
import { ClientMarginChart } from "@/components/dashboard/client-margin-chart";
import type { ClientMarginData } from "@/components/dashboard/client-margin-chart";

const monthKeys = [
  "m1", "m2", "m3", "m4", "m5", "m6",
  "m7", "m8", "m9", "m10", "m11", "m12",
] as const;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPNLData();

  const clientNames = data.revenueByClient.map((c) => c.name);
  const clientName = deslugify(slug, clientNames);

  if (!clientName) {
    notFound();
  }

  const clientRevenue = data.revenueByClient.find(
    (c) => c.name === clientName
  );
  if (!clientRevenue) {
    notFound();
  }
  const clientCost = data.costByClient.find((c) => c.name === clientName);

  const revenueYTD = clientRevenue.values.ytd;
  const costYTD = clientCost?.values.ytd ?? 0;
  const marginYTD = revenueYTD - costYTD;
  const marginPct = revenueYTD !== 0 ? (marginYTD / revenueYTD) * 100 : 0;

  const chartData: ClientMarginData[] = monthKeys.map((key, i) => {
    const rev = clientRevenue.values[key];
    const cost = clientCost?.values[key] ?? 0;
    return {
      month: MONTHS_KO[i],
      revenue: rev,
      cost: cost,
      margin: rev - cost,
    };
  });

  const tableData = chartData.map((row) => ({
    ...row,
    marginPct: row.revenue !== 0 ? (row.margin / row.revenue) * 100 : 0,
  }));

  type TableRow = (typeof tableData)[number];

  const columns = [
    { key: "month", header: "월" },
    {
      key: "revenue",
      header: "매출",
      align: "right" as const,
      cell: (row: TableRow) => formatKRW(row.revenue),
    },
    {
      key: "cost",
      header: "비용",
      align: "right" as const,
      cell: (row: TableRow) => formatKRW(row.cost),
    },
    {
      key: "margin",
      header: "마진",
      align: "right" as const,
      cell: (row: TableRow) => formatKRW(row.margin),
    },
    {
      key: "marginPct",
      header: "마진율",
      align: "right" as const,
      cell: (row: TableRow) => formatPercent(row.marginPct),
    },
  ];

  const clientColor = CLIENT_COLORS[clientName] ?? FALLBACK_COLOR;

  return (
    <div className="space-y-6">
      <Link href="/revenue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
        <ArrowLeft className="h-4 w-4" />
        매출 목록으로
      </Link>
      <Header title={clientName} description="클라이언트 상세" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard title="매출 (YTD)" value={formatKRW(revenueYTD)} />
        <SummaryCard title="비용 (YTD)" value={formatKRW(costYTD)} />
        <SummaryCard
          title="마진 (YTD)"
          value={formatKRW(marginYTD)}
          subValue={formatPercent(marginPct)}
          trend={marginYTD > 0 ? "up" : "down"}
        />
      </div>

      <ChartWrapper title="월별 매출 / 비용 / 마진" description="월별 추이">
        <ClientMarginChart data={chartData} clientColor={clientColor} />
      </ChartWrapper>

      <DataTable columns={columns} data={tableData} caption="월별 상세 데이터" />
    </div>
  );
}
