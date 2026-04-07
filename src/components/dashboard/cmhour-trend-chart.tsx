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
  ReferenceLine,
} from "recharts";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { formatKRW } from "@/lib/format";

interface CMHourTrendData {
  month: string;
  cmPerHour: number;
  isActual: boolean;
}

interface CMHourTrendChartProps {
  data: CMHourTrendData[];
  targetLine: number;
  q1Average: number;
  monthlyPace: { month: string; target: number }[];
}

export function CMHourTrendChart({
  data,
  targetLine,
  q1Average,
  monthlyPace,
}: CMHourTrendChartProps) {
  const chartData = data.map((d) => {
    const pace = monthlyPace.find((p) => p.month === d.month);
    return {
      ...d,
      monthlyTarget: pace?.target ?? null,
    };
  });

  return (
    <ChartWrapper
      title="CM/Hour 추이"
      description="월별 시간당 공헌이익 — 목표: 24만원"
      height={400}
    >
      <ComposedChart data={chartData} margin={{ left: 60, right: 30, top: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v: number) => `${Math.round(v / 10000)}만`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              cmPerHour: "CM/Hour",
              monthlyTarget: "월별 목표",
            };
            return [formatKRW(Number(value)), labels[String(name)] ?? String(name)];
          }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <ReferenceLine
          y={targetLine}
          stroke="#EF4444"
          strokeDasharray="8 4"
          label={{ value: `목표 ${formatKRW(targetLine)}`, position: "right", fontSize: 11, fill: "#EF4444" }}
        />
        <ReferenceLine
          y={q1Average}
          stroke="#94A3B8"
          strokeDasharray="4 4"
          label={{ value: `Q1 평균 ${formatKRW(q1Average)}`, position: "right", fontSize: 11, fill: "#94A3B8" }}
        />
        <Bar
          dataKey="cmPerHour"
          name="CM/Hour"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
        <Line
          dataKey="monthlyTarget"
          name="월별 목표"
          stroke="#F59E0B"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
          connectNulls={false}
        />
      </ComposedChart>
    </ChartWrapper>
  );
}
