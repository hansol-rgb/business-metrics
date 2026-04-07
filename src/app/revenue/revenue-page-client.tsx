"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DataTable } from "@/components/dashboard/data-table";
import { ClientRevenueBar } from "@/components/dashboard/client-revenue-bar";
import { ClientRevenueStacked } from "@/components/dashboard/client-revenue-stacked";
import { PackageDonut } from "@/components/dashboard/package-donut";
import { PackageTrend } from "@/components/dashboard/package-trend";
import { formatKRWFull } from "@/lib/format";
import { MONTHS_KO, MONTH_KEYS } from "@/lib/constants";

interface ClientBarItem {
  name: string;
  ytd: number;
  color: string;
}

interface PackageDonutItem {
  name: string;
  value: number;
  color: string;
}

type ClientTableRow = Record<string, unknown> & {
  name: string;
  slug: string;
  ytd: number;
  ytdProjection: number;
};

type PackageTableRow = Record<string, unknown> & {
  name: string;
  ytd: number;
  ytdProjection: number;
};

interface RevenuePageClientProps {
  clientBarData: ClientBarItem[];
  clientNames: string[];
  clientStackedData: { month: string; [key: string]: number | string }[];
  clientTableData: ClientTableRow[];
  packageDonutData: PackageDonutItem[];
  packageNames: string[];
  packageTrendData: { month: string; [key: string]: number | string }[];
  packageTableData: PackageTableRow[];
}

function makeMonthColumns<T extends Record<string, unknown>>() {
  return MONTH_KEYS.map((key, i) => ({
    key,
    header: MONTHS_KO[i],
    align: "right" as const,
    cell: (row: T) => formatKRWFull(Number(row[key] ?? 0)),
  }));
}

export function RevenuePageClient({
  clientBarData,
  clientNames,
  clientStackedData,
  clientTableData,
  packageDonutData,
  packageNames,
  packageTrendData,
  packageTableData,
}: RevenuePageClientProps) {
  const clientColumns = [
    {
      key: "name",
      header: "클라이언트",
      cell: (row: ClientTableRow) => (
        <Link
          href={`/clients/${row.slug}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "ytd",
      header: "YTD",
      align: "right" as const,
      cell: (row: ClientTableRow) => formatKRWFull(row.ytd),
    },
    {
      key: "ytdProjection",
      header: "YTD 전망",
      align: "right" as const,
      cell: (row: ClientTableRow) => formatKRWFull(row.ytdProjection),
    },
    ...makeMonthColumns<ClientTableRow>(),
  ];

  const packageColumns = [
    { key: "name", header: "패키지" },
    {
      key: "ytd",
      header: "YTD",
      align: "right" as const,
      cell: (row: PackageTableRow) => formatKRWFull(row.ytd),
    },
    {
      key: "ytdProjection",
      header: "YTD 전망",
      align: "right" as const,
      cell: (row: PackageTableRow) => formatKRWFull(row.ytdProjection),
    },
    ...makeMonthColumns<PackageTableRow>(),
  ];

  return (
    <Tabs defaultValue="clients">
      <TabsList>
        <TabsTrigger value="clients">고객별</TabsTrigger>
        <TabsTrigger value="packages">패키지별</TabsTrigger>
      </TabsList>

      <TabsContent value="clients">
        <div className="space-y-6 pt-4">
          <ChartWrapper
            title="고객별 YTD 매출"
            height={Math.max(300, clientBarData.length * 40)}
          >
            <ClientRevenueBar data={clientBarData} />
          </ChartWrapper>

          <ChartWrapper title="고객별 월 매출 (누적)">
            <ClientRevenueStacked
              clients={clientNames}
              data={clientStackedData}
            />
          </ChartWrapper>

          <div className="overflow-x-auto">
            <DataTable columns={clientColumns} data={clientTableData} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="packages">
        <div className="space-y-6 pt-4">
          <ChartWrapper title="패키지별 YTD 비중" height={400}>
            <PackageDonut data={packageDonutData} />
          </ChartWrapper>

          <ChartWrapper title="패키지별 월별 추이">
            <PackageTrend
              packages={packageNames}
              data={packageTrendData}
            />
          </ChartWrapper>

          <div className="overflow-x-auto">
            <DataTable columns={packageColumns} data={packageTableData} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
