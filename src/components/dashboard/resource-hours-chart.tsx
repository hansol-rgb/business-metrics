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
import { formatNumber } from "@/lib/format";
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

interface ResourceHoursChartProps {
  data: { month: string; fulltime: number; freelancer: number }[];
}

export function ResourceHoursChart({ data }: ResourceHoursChartProps) {
  return (
    <BarChart data={data} margin={CHART_MARGIN}>
      <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => formatNumber(Number(value))} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Bar dataKey="fulltime" name="정규직" stackId="hours" fill={SEMANTIC_COLORS.fulltime} />
      <Bar dataKey="freelancer" name="프리랜서" stackId="hours" fill={SEMANTIC_COLORS.freelancer} />
    </BarChart>
  );
}
