"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RevenueTrendChart, type RevenueTrendData } from "@/components/dashboard/revenue-trend-chart";
import { RevenueVsGoalChart, type RevenueGoalData } from "@/components/dashboard/revenue-vs-goal-chart";
import { formatKRW, formatPercent } from "@/lib/format";

type Segment = "profitability" | "goal" | "efficiency";

interface HomeData {
  revenue: number;
  revenueProjection: number;
  cost: number;
  margin: number;
  marginPct: number;
  goal: number;
  diff: number;
  diffPct: number;
  cmPerHour: number;
  totalHours: number;
  trendData: RevenueTrendData[];
  barData: RevenueGoalData[];
}

interface HomeClientProps {
  data: HomeData;
}

function FormulaBlock({
  left,
  leftLabel,
  right,
  rightLabel,
  operator,
  result,
  resultLabel,
  formatValue,
}: {
  left: number;
  leftLabel: string;
  right: number;
  rightLabel: string;
  operator: string;
  result: number;
  resultLabel: string;
  formatValue: (n: number) => string;
}) {
  return (
    <div className="mt-6 flex items-center gap-3 text-sm flex-wrap">
      <div className="rounded-md border bg-muted/30 px-4 py-3 text-center min-w-[120px]">
        <div className="text-xs text-muted-foreground">{leftLabel}</div>
        <div className="text-lg font-semibold mt-0.5">{formatValue(left)}</div>
      </div>
      <span className="text-muted-foreground font-mono text-lg">{operator}</span>
      <div className="rounded-md border bg-muted/30 px-4 py-3 text-center min-w-[120px]">
        <div className="text-xs text-muted-foreground">{rightLabel}</div>
        <div className="text-lg font-semibold mt-0.5">{formatValue(right)}</div>
      </div>
      <span className="text-muted-foreground font-mono text-lg">=</span>
      <div className="rounded-md border border-foreground/20 bg-background px-4 py-3 text-center min-w-[120px]">
        <div className="text-xs text-muted-foreground">{resultLabel}</div>
        <div className="text-lg font-bold mt-0.5">{formatValue(result)}</div>
      </div>
    </div>
  );
}

export function HomeClient({ data }: HomeClientProps) {
  const [segment, setSegment] = useState<Segment>("profitability");

  const segments: Record<Segment, {
    title: string;
    value: string;
    sub: string;
    formula: React.ReactNode;
  }> = {
    profitability: {
      title: "공헌이익",
      value: formatKRW(data.margin),
      sub: `공헌이익률 ${formatPercent(data.marginPct)} · 연간 전망 ${formatKRW(data.revenueProjection)}`,
      formula: (
        <FormulaBlock
          left={data.revenue}
          leftLabel="총 매출"
          right={data.cost}
          rightLabel="운영비용"
          operator="−"
          result={data.margin}
          resultLabel="공헌이익"
          formatValue={formatKRW}
        />
      ),
    },
    goal: {
      title: "목표 대비",
      value: `${data.diff >= 0 ? "+" : ""}${formatKRW(data.diff)}`,
      sub: `${data.diffPct >= 0 ? "+" : ""}${formatPercent(data.diffPct)} ${data.diff >= 0 ? "초과 달성" : "미달"}`,
      formula: (
        <FormulaBlock
          left={data.revenue}
          leftLabel="총 매출"
          right={data.goal}
          rightLabel="매출 목표"
          operator="−"
          result={data.diff}
          resultLabel="목표 대비"
          formatValue={formatKRW}
        />
      ),
    },
    efficiency: {
      title: "시간당 공헌이익 (CM/Hour)",
      value: formatKRW(data.cmPerHour),
      sub: `총 ${data.totalHours.toLocaleString()}시간 투입`,
      formula: (
        <FormulaBlock
          left={data.margin}
          leftLabel="공헌이익"
          right={data.totalHours}
          rightLabel="총 투입시간"
          operator="÷"
          result={data.cmPerHour}
          resultLabel="CM/Hour"
          formatValue={(n) =>
            n > 10000 ? formatKRW(n) : `${n.toLocaleString()}h`
          }
        />
      ),
    },
  };

  const current = segments[segment];

  return (
    <div className="space-y-6">
      {/* 세그먼트 탭 */}
      <Tabs
        value={segment}
        onValueChange={(v) => setSegment(v as Segment)}
      >
        <TabsList>
          <TabsTrigger value="profitability">수익성</TabsTrigger>
          <TabsTrigger value="goal">목표 달성</TabsTrigger>
          <TabsTrigger value="efficiency">효율성</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 핵심 지표 + 공식 분해 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">{current.title}</div>
          <div className="text-4xl font-bold mt-1">{current.value}</div>
          <div className="text-sm text-muted-foreground mt-1">{current.sub}</div>
          {current.formula}
        </CardContent>
      </Card>

      {/* 차트 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart data={data.trendData} />
        <RevenueVsGoalChart data={data.barData} />
      </div>
    </div>
  );
}
