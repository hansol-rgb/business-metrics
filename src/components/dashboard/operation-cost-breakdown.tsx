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
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

interface OperationCostBreakdownProps {
  data: { month: string; project: number; product: number; software: number }[];
}

export function OperationCostBreakdown({ data }: OperationCostBreakdownProps) {
  return (
    <ChartWrapper title="운영비 내역" description="카테고리별 월간 비용">
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => formatKRW(v)} />
        <Tooltip formatter={(v) => formatKRW(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="project" name="프로젝트 운영" fill={SEMANTIC_COLORS.projectOp} radius={[4, 4, 0, 0]} />
        <Bar dataKey="product" name="프로덕트 운영" fill={SEMANTIC_COLORS.productOp} radius={[4, 4, 0, 0]} />
        <Bar dataKey="software" name="소프트웨어 구독" fill={SEMANTIC_COLORS.software} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
