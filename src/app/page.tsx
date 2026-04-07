import { getPNLData } from "@/lib/data";
import { MONTHS_KO, ACTUAL_MONTHS } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { HomeClient } from "./home-client";
import type { RevenueTrendData } from "@/components/dashboard/revenue-trend-chart";
import type { RevenueGoalData } from "@/components/dashboard/revenue-vs-goal-chart";
import type { MonthlyValues } from "@/types/pnl";

function getMonthValue(values: MonthlyValues, month: number): number {
  return values[`m${month}` as keyof MonthlyValues] as number;
}

export default async function HomePage() {
  const data = await getPNLData();
  const { summary, resources } = data;

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

  const homeData = {
    revenue: summary.totalRevenue.ytd,
    revenueProjection: summary.totalRevenue.ytdProjection,
    cost: summary.operationCost.ytd,
    margin: summary.contributionMargin.ytd,
    marginPct: summary.contributionMarginPct.ytd,
    goal: summary.revenueGoal.ytd,
    diff: summary.diff.ytd,
    diffPct: summary.diffPct.ytd,
    cmPerHour: summary.cmPerHour.ytd,
    totalHours: resources.totalHours.ytd,
    trendData,
    barData,
  };

  return (
    <div className="space-y-6">
      <Header
        title="대시보드"
        description="BubbleShare 사업 지표 요약 (1-3월 실적, 4-12월 전망)"
      />
      <HomeClient data={homeData} />
      <p className="text-xs text-muted-foreground">
        * 1-3월 실적 데이터, 4-12월 전망 기준
      </p>
    </div>
  );
}
