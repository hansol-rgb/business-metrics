import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { MONTHS_KO, MONTH_KEYS, CLIENT_COLORS, PACKAGE_COLORS, FALLBACK_COLOR } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import { RevenuePageClient } from "./revenue-page-client";

export default async function RevenuePage() {
  const data = await getPNLData();

  const clientBarData = data.revenueByClient
    .filter((c) => c.values.ytd > 0)
    .map((c) => ({
      name: c.name,
      ytd: c.values.ytd,
      color: CLIENT_COLORS[c.name] ?? FALLBACK_COLOR,
    }));

  const activeClients = data.revenueByClient.filter((c) =>
    MONTH_KEYS.some((k) => c.values[k] !== 0)
  );
  const clientNames = activeClients.map((c) => c.name);

  const clientStackedData = MONTH_KEYS.map((key, i) => ({
    month: MONTHS_KO[i],
    ...Object.fromEntries(activeClients.map((c) => [c.name, c.values[key]])),
  }));

  const clientTableData = data.revenueByClient.map((c) => ({
    name: c.name,
    slug: slugify(c.name),
    ytd: c.values.ytd,
    ytdProjection: c.values.ytdProjection,
    ...Object.fromEntries(MONTH_KEYS.map((k) => [k, c.values[k]])),
  }));

  const packageDonutData = data.revenueByPackage
    .filter((p) => p.values.ytd > 0)
    .map((p) => ({
      name: p.name,
      value: p.values.ytd,
      color: PACKAGE_COLORS[p.name] ?? FALLBACK_COLOR,
    }));

  const activePackages = data.revenueByPackage.filter((p) =>
    MONTH_KEYS.some((k) => p.values[k] !== 0)
  );
  const packageNames = activePackages.map((p) => p.name);

  const packageTrendData = MONTH_KEYS.map((key, i) => ({
    month: MONTHS_KO[i],
    ...Object.fromEntries(activePackages.map((p) => [p.name, p.values[key]])),
  }));

  const packageTableData = data.revenueByPackage.map((p) => ({
    name: p.name,
    ytd: p.values.ytd,
    ytdProjection: p.values.ytdProjection,
    ...Object.fromEntries(MONTH_KEYS.map((k) => [k, p.values[k]])),
  }));

  return (
    <div className="space-y-6">
      <Header title="매출" description="고객별, 패키지별 매출 상세 (1-3월 실적, 4-12월 전망)" />
      <RevenuePageClient
        clientBarData={clientBarData}
        clientNames={clientNames}
        clientStackedData={clientStackedData}
        clientTableData={clientTableData}
        packageDonutData={packageDonutData}
        packageNames={packageNames}
        packageTrendData={packageTrendData}
        packageTableData={packageTableData}
      />

      <p className="text-xs text-muted-foreground mt-8">
        * 1-3월 실적 데이터, 4-12월 전망 기준
      </p>
    </div>
  );
}
