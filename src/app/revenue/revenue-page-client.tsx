"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DataTable } from "@/components/dashboard/data-table";
import { formatKRW, formatKRWFull } from "@/lib/format";
import {
  MONTHS_KO,
  MONTH_KEYS,
  ACTUAL_MONTHS,
  FALLBACK_COLOR,
} from "@/lib/constants";
import {
  CHART_MARGIN,
  CHART_MARGIN_VERTICAL,
  CHART_GRID_DASH,
} from "@/lib/chart-config";
import type { MonthlyValues } from "@/types/pnl";

type GroupBy = "client" | "package";
type Metric = "revenue" | "cost" | "margin";
type View = "compare" | "trend";

interface EntityData {
  name: string;
  slug: string;
  color: string;
  revenue: MonthlyValues;
  cost: MonthlyValues;
  margin: MonthlyValues;
}

interface RevenuePageClientProps {
  clientData: EntityData[];
  packageData: EntityData[];
}

const METRIC_LABELS: Record<Metric, string> = {
  revenue: "매출",
  cost: "비용",
  margin: "마진",
};

export function RevenuePageClient({
  clientData,
  packageData,
}: RevenuePageClientProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>("client");
  const [metric, setMetric] = useState<Metric>("revenue");
  const [view, setView] = useState<View>("compare");

  const entities = groupBy === "client" ? clientData : packageData;
  const metricLabel = METRIC_LABELS[metric];

  // --- Compare view: horizontal bar chart (YTD sorted) ---
  const barData = entities
    .map((e) => ({
      name: e.name,
      value: e[metric].ytd,
      color: e.color,
    }))
    .filter((d) => d.value !== 0)
    .sort((a, b) => b.value - a.value);

  // --- Trend view: line chart per entity ---
  const activeEntities = entities.filter((e) =>
    MONTH_KEYS.some((k) => e[metric][k] !== 0)
  );

  const trendData = MONTH_KEYS.map((key, i) => {
    const row: Record<string, number | string> = { month: MONTHS_KO[i] };
    for (const e of activeEntities) {
      const val = e[metric][key];
      if (i < ACTUAL_MONTHS) row[e.name] = val;
      if (i >= ACTUAL_MONTHS - 1) row[`${e.name}_forecast`] = val;
    }
    return row;
  });

  // --- Table ---
  type TableRow = {
    name: string;
    slug: string;
    color: string;
    ytd: number;
    ytdProjection: number;
    [key: string]: string | number;
  };

  const tableData: TableRow[] = entities.map((e) => ({
    name: e.name,
    slug: e.slug,
    color: e.color,
    ytd: e[metric].ytd,
    ytdProjection: e[metric].ytdProjection,
    ...Object.fromEntries(MONTH_KEYS.map((k) => [k, e[metric][k]])),
  }));

  const tableColumns = [
    {
      key: "name",
      header: groupBy === "client" ? "클라이언트" : "패키지",
      cell:
        groupBy === "client"
          ? (row: TableRow) => (
              <Link
                href={`/clients/${row.slug}`}
                className="text-primary hover:underline"
              >
                {row.name}
              </Link>
            )
          : undefined,
    },
    {
      key: "ytd",
      header: "YTD",
      align: "right" as const,
      cell: (row: TableRow) => formatKRWFull(row.ytd),
    },
    {
      key: "ytdProjection",
      header: "YTD 전망",
      align: "right" as const,
      cell: (row: TableRow) => formatKRWFull(row.ytdProjection),
    },
    ...MONTH_KEYS.map((key, i) => ({
      key,
      header: MONTHS_KO[i],
      align: "right" as const,
      cell: (row: TableRow) => formatKRWFull(Number(row[key] ?? 0)),
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={groupBy}
          onValueChange={(v) => setGroupBy(v as GroupBy)}
        >
          <TabsList>
            <TabsTrigger value="client">고객별</TabsTrigger>
            <TabsTrigger value="package">패키지별</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs
          value={metric}
          onValueChange={(v) => setMetric(v as Metric)}
        >
          <TabsList>
            <TabsTrigger value="revenue">매출</TabsTrigger>
            <TabsTrigger value="cost">비용</TabsTrigger>
            <TabsTrigger value="margin">마진</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={view} onValueChange={(v) => setView(v as View)}>
          <TabsList>
            <TabsTrigger value="compare">비교</TabsTrigger>
            <TabsTrigger value="trend">월별 추이</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart */}
      {view === "compare" ? (
        <ChartWrapper
          title={`${groupBy === "client" ? "고객별" : "패키지별"} YTD ${metricLabel}`}
          height={Math.max(300, barData.length * 40)}
        >
          <BarChart
            layout="vertical"
            data={barData}
            margin={CHART_MARGIN_VERTICAL}
          >
            <CartesianGrid
              strokeDasharray={CHART_GRID_DASH}
              className="stroke-muted"
              horizontal={false}
            />
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatKRW(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [formatKRW(Number(value)), metricLabel]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {barData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartWrapper>
      ) : (
        <ChartWrapper
          title={`${groupBy === "client" ? "고객별" : "패키지별"} 월별 ${metricLabel} 추이`}
        >
          <LineChart data={trendData} margin={CHART_MARGIN}>
            <CartesianGrid
              strokeDasharray={CHART_GRID_DASH}
              className="stroke-muted"
            />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v: number) => formatKRW(v)} />
            <Tooltip
              formatter={(value, name) => [
                formatKRW(Number(value)),
                String(name).replace(/_forecast$/, ""),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value: string) => value.replace(/_forecast$/, "")}
            />
            {activeEntities.map((e) => (
              <Line
                key={e.name}
                dataKey={e.name}
                stroke={e.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={e.name}
                connectNulls
              />
            ))}
            {activeEntities.map((e) => (
              <Line
                key={`${e.name}_forecast`}
                dataKey={`${e.name}_forecast`}
                stroke={e.color}
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ r: 2 }}
                name={`${e.name}_forecast`}
                legendType="none"
                connectNulls
              />
            ))}
          </LineChart>
        </ChartWrapper>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <DataTable columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
}
