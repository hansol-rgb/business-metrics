import { getPNLData } from "@/lib/data";
import { formatKRW, formatPercent } from "@/lib/format";
import { MONTHS_KO, ACTUAL_MONTHS } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  RevenueTrendChart,
  type RevenueTrendData,
} from "@/components/dashboard/revenue-trend-chart";
import {
  RevenueVsGoalChart,
  type RevenueGoalData,
} from "@/components/dashboard/revenue-vs-goal-chart";
import type { MonthlyValues } from "@/types/pnl";

function getMonthValue(values: MonthlyValues, month: number): number {
  return values[`m${month}` as keyof MonthlyValues] as number;
}

export default async function HomePage() {
  const { summary } = await getPNLData();

  const trendData: RevenueTrendData[] = MONTHS_KO.map((month, i) => {
    const m = i + 1;
    const revenue = getMonthValue(summary.totalRevenue, m);
    const goal = getMonthValue(summary.revenueGoal, m);

    return {
      month,
      actual: m <= ACTUAL_MONTHS ? revenue : null,
      forecast: m >= ACTUAL_MONTHS ? revenue : null,
      goal,
    };
  });

  const barData: RevenueGoalData[] = MONTHS_KO.map((month, i) => ({
    month,
    revenue: getMonthValue(summary.totalRevenue, i + 1),
    goal: getMonthValue(summary.revenueGoal, i + 1),
  }));

  const marginTrend =
    summary.contributionMarginPct.ytd >= 80 ? "up" : "down";
  const diffTrend = summary.diff.ytd >= 0 ? "up" : "down";
  const diffLabel = summary.diff.ytd >= 0 ? "목표 초과" : "목표 미달";

  return (
    <div className="space-y-6">
      <Header title="대시보드" description="BubbleShare 사업 지표 요약 (1-3월 실적, 4-12월 전망)" />

      {/* 수익성 그룹 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">수익성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="총 매출"
            value={formatKRW(summary.totalRevenue.ytd)}
            subValue={`연간 전망 ${formatKRW(summary.totalRevenue.ytdProjection)}`}
          />
          <SummaryCard
            title="운영비용"
            value={formatKRW(summary.operationCost.ytd)}
          />
          <SummaryCard
            title="공헌이익"
            value={formatKRW(summary.contributionMargin.ytd)}
            subValue="매출 - 비용"
          />
          <SummaryCard
            title="공헌이익률"
            value={formatPercent(summary.contributionMarginPct.ytd)}
            trend={marginTrend}
          />
        </div>
      </div>

      {/* 목표 달성 그룹 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">목표 달성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="매출 목표"
            value={formatKRW(summary.revenueGoal.ytd)}
          />
          <SummaryCard
            title="목표 대비"
            value={formatKRW(summary.diff.ytd)}
            trend={diffTrend}
            trendLabel={diffLabel}
          />
          <SummaryCard
            title="달성률"
            value={formatPercent(summary.diffPct.ytd)}
          />
        </div>
      </div>

      {/* 효율성 그룹 */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">효율성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
          <SummaryCard
            title="시간당 공헌이익 (CM/Hour)"
            value={formatKRW(summary.cmPerHour.ytd)}
            subValue="공헌이익 / 총 투입시간"
          />
        </div>
      </div>

      {/* 차트 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart data={trendData} />
        <RevenueVsGoalChart data={barData} />
      </div>

      <p className="text-xs text-muted-foreground">
        * 1-3월 실적 데이터, 4-12월 전망 기준
      </p>
    </div>
  );
}
