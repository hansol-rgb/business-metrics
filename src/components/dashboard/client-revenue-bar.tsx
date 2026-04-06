"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { formatKRW } from "@/lib/format";

interface ClientBarData {
  name: string;
  ytd: number;
  color: string;
}

interface ClientRevenueBarProps {
  data: ClientBarData[];
}

export function ClientRevenueBar({ data }: ClientRevenueBarProps) {
  const sorted = [...data].sort((a, b) => b.ytd - a.ytd);

  return (
    <BarChart layout="vertical" data={sorted} margin={{ left: 80, right: 20 }}>
      <XAxis type="number" tickFormatter={(v: number) => formatKRW(v)} />
      <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
      <Tooltip
        formatter={(value) => [formatKRW(Number(value)), "매출"]}
        labelStyle={{ fontWeight: 600 }}
      />
      <Bar dataKey="ytd" radius={[0, 4, 4, 0]}>
        {sorted.map((entry) => (
          <Cell key={entry.name} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  );
}
