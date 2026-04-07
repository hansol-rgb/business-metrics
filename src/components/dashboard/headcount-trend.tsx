"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ACTUAL_MONTHS } from "@/lib/constants";
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

interface HeadcountTrendProps {
  data: { month: string; headcount: number }[];
}

export function HeadcountTrend({ data }: HeadcountTrendProps) {
  const chartData = data.map((d, i) => ({
    month: d.month,
    actual: i < ACTUAL_MONTHS ? d.headcount : undefined,
    forecast: i >= ACTUAL_MONTHS - 1 ? d.headcount : undefined,
  }));

  return (
    <LineChart data={chartData} margin={CHART_MARGIN}>
      <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
      <XAxis dataKey="month" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line
        dataKey="actual"
        name="실적"
        stroke={SEMANTIC_COLORS.revenue}
        strokeWidth={2}
        dot={{ r: 4 }}
      />
      <Line
        dataKey="forecast"
        name="예측"
        stroke={SEMANTIC_COLORS.revenue}
        strokeWidth={2}
        strokeDasharray="8 4"
        dot={{ r: 4 }}
      />
    </LineChart>
  );
}
