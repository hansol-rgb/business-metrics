import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { HomeClient } from "./home-client";

export default async function HomePage() {
  const { summary } = await getPNLData();

  const rows = [
    { label: "Total Revenue (매출)", values: summary.totalRevenue, type: "primary" as const, format: "krw" as const },
    { label: "Operation Cost (운영비용)", values: summary.operationCost, type: "primary" as const, format: "krw" as const },
    { label: "Contribution Margin (공헌이익)", values: summary.contributionMargin, type: "derived" as const, format: "krw" as const },
    { label: "Contribution Margin %", values: summary.contributionMarginPct, type: "derived" as const, format: "percent" as const },
    { label: "Revenue Goal (매출 목표)", values: summary.revenueGoal, type: "primary" as const, format: "krw" as const },
    { label: "Diff (목표 대비)", values: summary.diff, type: "derived" as const, format: "krw" as const },
    { label: "Diff %", values: summary.diffPct, type: "derived" as const, format: "percent" as const },
    { label: "CM/Hour (시간당 공헌이익)", values: summary.cmPerHour, type: "primary" as const, format: "krw" as const },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="대시보드"
        description="BubbleShare 사업 지표 요약 (1-3월 실적, 4-12월 전망)"
      />
      <HomeClient rows={rows} />
      <p className="text-xs text-muted-foreground">
        * 노란 배경: 1차값 (직접 발생) · 보라 배경: 2차값 (계산 결과) · 1-3월 실적, 4-12월 전망
      </p>
    </div>
  );
}
