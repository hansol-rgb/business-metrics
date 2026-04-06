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

interface CostPackageBarProps {
  data: { name: string; ytd: number; color: string }[];
}

export function CostPackageBar({ data }: CostPackageBarProps) {
  return (
    <ChartWrapper title="패키지별 비용" description="YTD 기준">
      <BarChart data={data} margin={{ left: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
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
