"use client";

import type { PieLabelRenderProps } from "recharts";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatKRW } from "@/lib/format";

interface PackageDonutData {
  name: string;
  value: number;
  color: string;
}

interface PackageDonutProps {
  data: PackageDonutData[];
}

const RADIAN = Math.PI / 180;

function renderLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);
  const name = String(props.name ?? "");

  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {name} ({(percent * 100).toFixed(1)}%)
    </text>
  );
}

export function PackageDonut({ data }: PackageDonutProps) {
  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={120}
        dataKey="value"
        label={renderLabel}
        labelLine={false}
      >
        {data.map((entry) => (
          <Cell key={entry.name} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [formatKRW(Number(value)), "매출"]} />
    </PieChart>
  );
}
