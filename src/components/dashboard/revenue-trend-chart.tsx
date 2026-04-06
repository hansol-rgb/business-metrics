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
    <ChartWrapper title="매출 추이" description="월별 실적 / 전망 / 목표">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v: number) => formatKRW(v)} width={70} />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        <Line
          name="실적"
          type="monotone"
          dataKey="actual"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ r: 4 }}
          connectNulls={false}
        />
        <Line
          name="전망"
          type="monotone"
          dataKey="forecast"
          stroke="#93C5FD"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3 }}
          connectNulls={false}
        />
        <Line
          name="목표"
          type="monotone"
          dataKey="goal"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartWrapper>
  );
}
