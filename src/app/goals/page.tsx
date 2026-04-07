import { getPNLData } from "@/lib/data";
import { getGrowthItems } from "@/lib/growth";
import { formatKRW } from "@/lib/format";
import { MONTHS_KO, MONTH_KEYS, Q2_GOAL } from "@/lib/constants";
import { Header } from "@/components/layout/header";
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
  const q1Hours = resources.totalHours.ytd;
  const q1CMPerHour = q1Hours > 0 ? Math.round(summary.contributionMargin.ytd / q1Hours) : 0;

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

  // 월별 목표 매핑 (4-6월)
  const monthlyPace = Q2_GOAL.monthlyPace.map((target, i) => ({
    month: MONTHS_KO[3 + i], // 4월, 5월, 6월
    target,
  }));

  return (
    <div className="space-y-6">
      <Header
        title="2분기 성장 목표"
        description="CM/Hour 개선을 통한 공헌이익 13.6억 달성"
      />

      <Card>
        <CardContent className="pt-6">
          <ProgressBar
            label="CM/Hour"
            current={q1CMPerHour}
            target={Q2_GOAL.targetCMPerHour}
            formatValue={(n) => formatKRW(n)}
          />
        </CardContent>
      </Card>

      <CMHourTrendChart
        data={cmhourData.filter((d) => d.isActual)}
        targetLine={Q2_GOAL.targetCMPerHour}
        q1Average={q1CMPerHour}
        monthlyPace={monthlyPace}
      />

      <GrowthItemsTable items={growthItems} />

      <p className="text-xs text-muted-foreground">
        * CM/Hour = 공헌이익 / 총 투입시간. Q2 목표 달성을 위해 19만 → 24만으로 개선 필요.
      </p>
    </div>
  );
}
