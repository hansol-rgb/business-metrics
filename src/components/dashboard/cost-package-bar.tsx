"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { formatKRW } from "@/lib/format";
import { CHART_MARGIN_VERTICAL, CHART_GRID_DASH } from "@/lib/chart-config";

interface CostPackageBarProps {
  data: { name: string; ytd: number; color: string }[];
}

export function CostPackageBar({ data }: CostPackageBarProps) {
  return (
    <ChartWrapper title="패키지별 비용" description="YTD 기준">
      <BarChart data={data} margin={CHART_MARGIN_VERTICAL}>
        <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(v) => formatKRW(v)} />
        <Tooltip formatter={(v) => formatKRW(Number(v))} />
        <Bar dataKey="ytd" name="YTD 비용" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
}
