"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatKRW } from "@/lib/format";
import { CHART_MARGIN, CHART_GRID_DASH, SEMANTIC_COLORS } from "@/lib/chart-config";

export interface ClientMarginData {
  month: string;
  revenue: number;
  cost: number;
  margin: number;
}

interface ClientMarginChartProps {
  data: ClientMarginData[];
  clientColor?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-sm">
      <p className="mb-1 text-sm font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatKRW(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function ClientMarginChart({ data, clientColor }: ClientMarginChartProps) {
  const revenueColor = clientColor ?? SEMANTIC_COLORS.actual;

  return (
    <ComposedChart data={data} margin={CHART_MARGIN}>
      <CartesianGrid strokeDasharray={CHART_GRID_DASH} className="stroke-muted" />
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} tickFormatter={formatKRW} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Bar dataKey="revenue" name="매출" fill={revenueColor} radius={[4, 4, 0, 0]} />
      <Bar dataKey="cost" name="비용" fill="#F43F5E" radius={[4, 4, 0, 0]} />
      <Line
        type="monotone"
        dataKey="margin"
        name="마진"
        stroke={SEMANTIC_COLORS.margin}
        strokeWidth={2}
        dot={{ r: 3 }}
      />
    </ComposedChart>
  );
}
