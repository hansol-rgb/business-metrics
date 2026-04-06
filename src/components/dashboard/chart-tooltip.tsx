"use client";

import { formatKRW } from "@/lib/format";

interface TooltipEntry {
  name: string;
  value: number | null;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-md border bg-background p-3 shadow-sm">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map(
        (entry) =>
          entry.value != null && (
            <p key={entry.name} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatKRW(entry.value)}
            </p>
          ),
      )}
    </div>
  );
}
