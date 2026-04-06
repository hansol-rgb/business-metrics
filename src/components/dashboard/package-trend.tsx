"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { formatKRW } from "@/lib/format";
import { PACKAGE_COLORS, ACTUAL_MONTHS, FALLBACK_COLOR } from "@/lib/constants";

interface PackageTrendProps {
  packages: string[];
  data: { month: string; [packageName: string]: number | string }[];
}

export function PackageTrend({ packages, data }: PackageTrendProps) {
  // Split each package into actual (solid) and forecast (dashed) series.
  // The overlap at the boundary month (ACTUAL_MONTHS - 1) ensures continuity.
  const chartData = data.map((d, i) => {
    const row: Record<string, number | string> = { month: d.month };
    for (const pkg of packages) {
      const val = Number(d[pkg] ?? 0);
      if (i < ACTUAL_MONTHS) row[pkg] = val;
      if (i >= ACTUAL_MONTHS - 1) row[`${pkg}_forecast`] = val;
    }
    return row;
  });

  return (
    <LineChart data={chartData} margin={{ left: 20, right: 20 }}>
      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      <YAxis tickFormatter={(v: number) => formatKRW(v)} />
      <Tooltip
        formatter={(value, name) => [
          formatKRW(Number(value)),
          String(name).replace(/_forecast$/, ""),
        ]}
      />
      <Legend
        formatter={(value: string) => value.replace(/_forecast$/, "")}
      />
      {packages.map((pkg) => (
        <Line
          key={pkg}
          dataKey={pkg}
          stroke={PACKAGE_COLORS[pkg] ?? FALLBACK_COLOR}
          strokeWidth={2}
          dot={{ r: 3 }}
          name={pkg}
          connectNulls
        />
      ))}
      {packages.map((pkg) => (
        <Line
          key={`${pkg}_forecast`}
          dataKey={`${pkg}_forecast`}
          stroke={PACKAGE_COLORS[pkg] ?? FALLBACK_COLOR}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 2 }}
          name={`${pkg}_forecast`}
          legendType="none"
          connectNulls
        />
      ))}
    </LineChart>
  );
}
