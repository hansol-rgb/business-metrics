"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatKRW } from "@/lib/format";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

export interface RevenueTrendData {
  month: string;
  actual: number | null;
  forecast: number | null;
  goal: number;
}

interface RevenueTrendChartProps {
  data: RevenueTrendData[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <ChartWrapper
      title="매출 추이"
      description="월별 실적 / 전망 / 목표 — ━ 실적 (1-3월) ┄ 전망 (4-12월)"
    >
      <LineChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v: number) => formatKRW(v)} width={70} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          name="실적"
          type="monotone"
          dataKey="actual"
          stroke={SEMANTIC_COLORS.actual}
          strokeWidth={2}
          dot={{ r: 4 }}
          connectNulls={false}
        />
        <Line
          name="전망"
          type="monotone"
          dataKey="forecast"
          stroke={SEMANTIC_COLORS.forecast}
          strokeWidth={2}
          strokeDasharray="8 4"
          dot={{ r: 3 }}
          connectNulls={false}
        />
        <Line
          name="목표"
          type="monotone"
          dataKey="goal"
          stroke={SEMANTIC_COLORS.goal}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartWrapper>
  );
}
