"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { formatKRW } from "@/lib/format";
import { CLIENT_COLORS, FALLBACK_COLOR } from "@/lib/constants";
import { CHART_MARGIN, CHART_GRID_DASH } from "@/lib/chart-config";

interface ClientRevenueStackedProps {
  clients: string[];
  data: { month: string; [clientName: string]: number | string }[];
}

export function ClientRevenueStacked({
  clients,
  data,
}: ClientRevenueStackedProps) {
  return (
    <BarChart data={data} margin={CHART_MARGIN}>
      <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tickFormatter={(v: number) => formatKRW(v)} />
      <Tooltip
        formatter={(value, name) => [formatKRW(Number(value)), String(name)]}
      />
      <Legend wrapperStyle={{ fontSize: 12 }} />
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
