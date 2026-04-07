import { getPNLData } from "@/lib/data";
import { getGrowthItems } from "@/lib/growth";
import { formatKRW } from "@/lib/format";
import { MONTHS_KO, MONTH_KEYS, Q2_GOAL } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { CMHourTrendChart } from "@/components/dashboard/cmhour-trend-chart";
import { GrowthItemsTable } from "@/components/dashboard/growth-items-table";
import { Card, CardContent } from "@/components/ui/card";

export default async function GoalsPage() {
  const [data, growthItems] = await Promise.all([
    getPNLData(),
    getGrowthItems(),
  ]);

  const { resources, summary } = data;

  // Q1 실적 (1-3월)
  const q1CM = summary.contributionMargin.ytd;
  const q1Hours = resources.totalHours.ytd;
  const q1CMPerHour = q1Hours > 0 ? Math.round(q1CM / q1Hours) : 0;

  // 월별 CM/Hour 데이터
  const cmhourData = MONTH_KEYS.map((key, i) => {
    const hours = resources.totalHours[key];
    const cm = summary.contributionMargin[key];
    const cmPerHour = hours > 0 ? Math.round(cm / hours) : 0;
    return {
      month: MONTHS_KO[i],
      cmPerHour,
      isActual: i < 3, // 1-3월은 실적
    };
  });

  // 1-3월만 유의미한 값 (4월 이후는 전망이라 CM/Hour가 비정상적으로 높음)
  const actualMonths = cmhourData.filter((d) => d.isActual && d.cmPerHour > 0);
  const latestCMPerHour = actualMonths.length > 0
    ? actualMonths[actualMonths.length - 1].cmPerHour
    : 0;

  // 월별 목표 매핑 (4-6월)
  const monthlyPace = Q2_GOAL.monthlyPace.map((target, i) => ({
    month: MONTHS_KO[3 + i], // 4월, 5월, 6월
    target,
  }));

  // Q2 공헌이익 진척 (4-6월 합산)
  const q2CM = [3, 4, 5].reduce(
    (sum, i) => sum + summary.contributionMargin[MONTH_KEYS[i]],
    0
  );

  // 효율화 아이템 통계
  const completedItems = growthItems.filter((i) => i.status === "completed");
  const savedHours = completedItems.reduce(
    (sum, i) => sum + i.estimatedHoursSaved,
    0
  );

  return (
    <div className="space-y-6">
      <Header
        title="2분기 성장 목표"
        description="공헌이익 13.6억 달성을 위한 CM/Hour 개선 추적"
      />

      {/* 목표 진척 프로그레스 */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <ProgressBar
            label="CM/Hour"
            current={q1CMPerHour}
            target={Q2_GOAL.targetCMPerHour}
            formatValue={(n) => formatKRW(n)}
          />
          <ProgressBar
            label="공헌이익 (Q2)"
            current={q2CM}
            target={Q2_GOAL.targetCM}
            formatValue={(n) => formatKRW(n)}
          />
        </CardContent>
      </Card>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="현재 CM/Hour"
          value={formatKRW(q1CMPerHour)}
          subValue={`목표 ${formatKRW(Q2_GOAL.targetCMPerHour)}`}
          trend={q1CMPerHour >= Q2_GOAL.targetCMPerHour ? "up" : "neutral"}
        />
        <SummaryCard
          title="Q1 공헌이익"
          value={formatKRW(q1CM)}
          subValue={`Q1 투입 ${q1Hours.toLocaleString()}시간`}
        />
        <SummaryCard
          title="Q2 공헌이익 (현재)"
          value={formatKRW(q2CM)}
          subValue={`목표 ${formatKRW(Q2_GOAL.targetCM)}`}
          trend={q2CM > 0 ? "up" : "neutral"}
        />
        <SummaryCard
          title="효율화 절감 시간"
          value={`${savedHours}시간`}
          subValue={`${completedItems.length}건 완료 / ${growthItems.length}건 전체`}
        />
      </div>

      {/* CM/Hour 추이 차트 */}
      <CMHourTrendChart
        data={cmhourData.filter((d) => d.isActual)}
        targetLine={Q2_GOAL.targetCMPerHour}
        q1Average={q1CMPerHour}
        monthlyPace={monthlyPace}
      />

      {/* 효율화 아이템 리스트 */}
      <GrowthItemsTable items={growthItems} />

      <p className="text-xs text-muted-foreground">
        * CM/Hour = 공헌이익 / 총 투입시간. Q2 목표 달성을 위해 19만 → 24만으로 개선 필요.
      </p>
    </div>
  );
}
