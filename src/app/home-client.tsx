"use client";

import { formatKRW, formatPercent } from "@/lib/format";
import { MONTHS_KO } from "@/lib/constants";
import type { MonthlyValues } from "@/types/pnl";

interface SummaryRow {
  label: string;
  values: MonthlyValues;
  type: "primary" | "derived";
  format: "krw" | "percent";
}

interface HomeClientProps {
  rows: SummaryRow[];
}

function formatCell(value: number, format: "krw" | "percent"): string {
  if (format === "percent") return formatPercent(value);
  return formatKRW(value);
}

export function HomeClient({ rows }: HomeClientProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground sticky left-0 bg-background z-10 min-w-[200px]">
              Summary
            </th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground min-w-[100px]">YTD</th>
            <th className="text-right py-2 px-3 font-medium text-muted-foreground min-w-[100px]">연간 전망</th>
            {MONTHS_KO.map((m) => (
              <th key={m} className="text-right py-2 px-3 font-medium text-muted-foreground min-w-[90px]">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isPrimary = row.type === "primary";
            const bgClass = isPrimary
              ? "bg-amber-50 dark:bg-amber-950/30"
              : "bg-violet-50 dark:bg-violet-950/30";
            const fontClass = isPrimary ? "font-medium" : "font-semibold";

            const monthKeys = [
              "m1", "m2", "m3", "m4", "m5", "m6",
              "m7", "m8", "m9", "m10", "m11", "m12",
            ] as const;

            return (
              <tr key={row.label} className={`border-b ${bgClass}`}>
                <td className={`py-2 px-3 ${fontClass} sticky left-0 z-10 ${bgClass}`}>
                  {row.label}
                </td>
                <td className="text-right py-2 px-3 font-semibold">
                  {formatCell(row.values.ytd, row.format)}
                </td>
                <td className="text-right py-2 px-3 text-muted-foreground">
                  {formatCell(row.values.ytdProjection, row.format)}
                </td>
                {monthKeys.map((key, i) => {
                  const val = row.values[key];
                  const isActual = i < 3;
                  return (
                    <td
                      key={key}
                      className={`text-right py-2 px-3 ${
                        isActual ? "" : "text-muted-foreground"
                      }`}
                    >
                      {formatCell(val, row.format)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
