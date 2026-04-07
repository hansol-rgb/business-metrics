import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { CostRankingList } from "@/components/dashboard/cost-ranking-list";
import { formatKRW, formatKRWFull, formatNumber } from "@/lib/format";

export default async function CostPage() {
  const data = await getPNLData();

  const {
    costByClient,
    operationCosts,
    grandTotalCost,
    totalProjectCost,
    refOperationCost,
    resources,
  } = data;

  const costItems = [
    ...costByClient
      .filter((c) => c.values.ytd > 0)
      .map((c) => ({ name: c.name, amount: c.values.ytd, category: "프로젝트 직접비" })),
    ...operationCosts
      .filter((c) => c.values.ytd > 0)
      .map((c) => ({ name: c.subcategory, amount: c.values.ytd, category: "운영비" })),
  ].sort((a, b) => b.amount - a.amount);

  const maxAmount = costItems[0]?.amount ?? 1;

  return (
    <div className="space-y-6">
      <Header title="비용" description="비용 현황 및 시간 투입 (1-3월 실적, 4-12월 전망)" />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="총 비용 (연간누계)"
          value={formatKRW(grandTotalCost.ytd)}
          subValue={formatKRWFull(grandTotalCost.ytd)}
        />
        <SummaryCard
          title="프로젝트 비용 (연간누계)"
          value={formatKRW(totalProjectCost.ytd)}
          subValue={formatKRWFull(totalProjectCost.ytd)}
        />
        <SummaryCard
          title="운영비 (연간누계)"
          value={formatKRW(refOperationCost.ytd)}
          subValue={formatKRWFull(refOperationCost.ytd)}
        />
      </div>

      <CostRankingList items={costItems} maxAmount={maxAmount} />

      <div className="space-y-2">
        <h2 className="text-base font-semibold">시간으로 투입한 비용</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="총 투입 시간 (연간누계)"
            value={`${formatNumber(resources.totalHours.ytd)}시간`}
          />
          <SummaryCard
            title="정규직 (연간누계)"
            value={`${formatNumber(resources.fulltimeHours.ytd)}시간`}
          />
          <SummaryCard
            title="프리랜서 (연간누계)"
            value={`${formatNumber(resources.freelancerHours.ytd)}시간`}
          />
        </div>
      </div>
    </div>
  );
}
