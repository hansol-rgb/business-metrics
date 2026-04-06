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
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line
        dataKey="actual"
        name="실적"
        stroke="#3B82F6"
        strokeWidth={2}
        dot={{ r: 4 }}
      />
      <Line
        dataKey="forecast"
        name="예측"
        stroke="#3B82F6"
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={{ r: 4 }}
      />
    </LineChart>
  );
}
