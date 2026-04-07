import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { MONTH_KEYS, CLIENT_COLORS, PACKAGE_COLORS, FALLBACK_COLOR } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import type { MonthlyValues } from "@/types/pnl";
import { RevenuePageClient } from "./revenue-page-client";

const ZERO_VALUES: MonthlyValues = {
  ytd: 0, ytdProjection: 0,
  m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0,
  m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
};

function subtractMonthly(a: MonthlyValues, b: MonthlyValues): MonthlyValues {
  const result = { ...a };
  for (const key of ['ytd', 'ytdProjection', ...MONTH_KEYS] as const) {
    (result as Record<string, number>)[key] = a[key] - b[key];
  }
  return result;
}

export default async function RevenuePage() {
  const data = await getPNLData();

  const clientData = data.revenueByClient.map((client) => {
    const cost = data.costByClient.find((c) => c.name === client.name);
    const costValues = cost?.values ?? ZERO_VALUES;
    return {
      name: client.name,
      slug: slugify(client.name),
      color: CLIENT_COLORS[client.name] ?? FALLBACK_COLOR,
      revenue: client.values,
      cost: costValues,
      margin: subtractMonthly(client.values, costValues),
    };
  });

  const packageData = data.revenueByPackage.map((pkg) => {
    const cost = data.costByPackage.find((p) => p.name === pkg.name);
    const costValues = cost?.values ?? ZERO_VALUES;
    return {
      name: pkg.name,
      slug: slugify(pkg.name),
      color: PACKAGE_COLORS[pkg.name] ?? FALLBACK_COLOR,
      revenue: pkg.values,
      cost: costValues,
      margin: subtractMonthly(pkg.values, costValues),
    };
  });

  return (
    <div className="space-y-6">
      <Header title="매출" description="고객별, 패키지별 매출 상세 (1-3월 실적, 4-12월 전망)" />
      <RevenuePageClient clientData={clientData} packageData={packageData} />
      <p className="text-xs text-muted-foreground mt-8">
        * 1-3월 실적 데이터, 4-12월 전망 기준
      </p>
    </div>
  );
}
