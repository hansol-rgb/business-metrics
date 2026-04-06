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

interface CostClientBarProps {
  data: { name: string; ytd: number; color: string }[];
}

export function CostClientBar({ data }: CostClientBarProps) {
  return (
    <ChartWrapper title="고객별 비용" description="YTD 기준" height={Math.max(300, data.length * 40)}>
      <BarChart layout="vertical" data={data} margin={{ left: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
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
