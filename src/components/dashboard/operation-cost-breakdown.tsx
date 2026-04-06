"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { formatKRW } from "@/lib/format";

interface OperationCostBreakdownProps {
  data: { month: string; project: number; product: number; software: number }[];
}

export function OperationCostBreakdown({ data }: OperationCostBreakdownProps) {
  return (
    <ChartWrapper title="운영비 내역" description="카테고리별 월간 비용">
      <BarChart data={data} margin={{ left: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => formatKRW(v)} />
        <Tooltip formatter={(v) => formatKRW(Number(v))} />
        <Legend />
        <Bar dataKey="project" name="Project Operation" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="product" name="Product Operation" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="software" name="Software Subscription" fill="#F59E0B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
