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

interface CostClientBarProps {
  data: { name: string; ytd: number; color: string }[];
}

export function CostClientBar({ data }: CostClientBarProps) {
  return (
    <ChartWrapper title="고객별 비용" description="YTD 기준" height={Math.max(300, data.length * 40)}>
      <BarChart layout="vertical" data={data} margin={CHART_MARGIN_VERTICAL}>
        <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => formatKRW(v)} />
        <YAxis type="category" dataKey="name" width={100} />
        <Tooltip formatter={(v) => formatKRW(Number(v))} />
        <Bar dataKey="ytd" name="YTD 비용" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
}
