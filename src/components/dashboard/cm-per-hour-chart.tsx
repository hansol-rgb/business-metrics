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

interface CMPerHourChartProps {
  data: { month: string; cmPerHour: number }[];
}

export function CMPerHourChart({ data }: CMPerHourChartProps) {
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip formatter={(value) => formatKRW(Number(value))} />
      <Bar dataKey="cmPerHour" name="CM/Hour" fill="#10B981" />
    </BarChart>
  );
}
