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

interface ResourceHoursChartProps {
  data: { month: string; fulltime: number; freelancer: number }[];
}

export function ResourceHoursChart({ data }: ResourceHoursChartProps) {
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => formatNumber(Number(value))} />
      <Legend />
      <Bar dataKey="fulltime" name="정규직" stackId="hours" fill="#3B82F6" />
      <Bar dataKey="freelancer" name="프리랜서" stackId="hours" fill="#F59E0B" />
    </BarChart>
  );
}
