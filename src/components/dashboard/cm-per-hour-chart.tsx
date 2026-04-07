"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatKRW } from "@/lib/format";
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

interface CMPerHourChartProps {
  data: { month: string; cmPerHour: number }[];
}

export function CMPerHourChart({ data }: CMPerHourChartProps) {
  return (
    <BarChart data={data} margin={CHART_MARGIN}>
      <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => formatKRW(Number(value))} />
      <Bar dataKey="cmPerHour" name="CM/Hour" fill={SEMANTIC_COLORS.margin} />
    </BarChart>
  );
}
