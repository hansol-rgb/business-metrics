"use client";

import {
  BarChart,
  Bar,
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

export interface RevenueGoalData {
  month: string;
  revenue: number;
  goal: number;
}

interface RevenueVsGoalChartProps {
  data: RevenueGoalData[];
}

export function RevenueVsGoalChart({ data }: RevenueVsGoalChartProps) {
  return (
    <ChartWrapper title="매출 vs 목표" description="월별 매출과 목표 비교">
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v: number) => formatKRW(v)} width={70} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="매출" dataKey="revenue" fill={SEMANTIC_COLORS.revenue} radius={[4, 4, 0, 0]} />
        <Bar name="목표" dataKey="goal" fill={SEMANTIC_COLORS.goal} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
