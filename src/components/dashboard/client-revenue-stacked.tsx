"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { formatKRW } from "@/lib/format";
import { CLIENT_COLORS, FALLBACK_COLOR } from "@/lib/constants";

interface ClientRevenueStackedProps {
  clients: string[];
  data: { month: string; [clientName: string]: number | string }[];
}

export function ClientRevenueStacked({
  clients,
  data,
}: ClientRevenueStackedProps) {
  return (
    <BarChart data={data} margin={{ left: 20, right: 20 }}>
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tickFormatter={(v: number) => formatKRW(v)} />
      <Tooltip
        formatter={(value, name) => [formatKRW(Number(value)), String(name)]}
      />
      <Legend />
      {clients.map((client) => (
        <Bar
          key={client}
          dataKey={client}
          stackId="revenue"
          fill={CLIENT_COLORS[client] ?? FALLBACK_COLOR}
        />
      ))}
    </BarChart>
  );
}
