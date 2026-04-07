import { getPNLData } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DataTable } from "@/components/dashboard/data-table";
import { ResourceHoursChart } from "@/components/dashboard/resource-hours-chart";
import { HeadcountTrend } from "@/components/dashboard/headcount-trend";
import { CMPerHourChart } from "@/components/dashboard/cm-per-hour-chart";
import { formatKRW, formatNumber } from "@/lib/format";
import { MONTHS_KO, MONTH_KEYS } from "@/lib/constants";

export default async function ResourcesPage() {
  const { resources } = await getPNLData();

  const hoursData = MONTH_KEYS.map((key, i) => ({
    month: MONTHS_KO[i],
    fulltime: resources.fulltimeHours[key],
    freelancer: resources.freelancerHours[key],
  }));

  const headcountData = MONTH_KEYS.map((key, i) => ({
    month: MONTHS_KO[i],
    headcount: resources.fulltimeHead[key],
  }));

  const cmPerHourData = MONTH_KEYS.map((key, i) => ({
    month: MONTHS_KO[i],
    cmPerHour: resources.cmPerHour[key],
  }));

  const tableData = [
    {
      label: "총 투입시간",
      values: resources.totalHours,
      format: formatNumber,
    },
    {
      label: "시간당 공헌이익",
      values: resources.cmPerHour,
      format: formatKRW,
    },
    {
      label: "정규직(명)",
      values: resources.fulltimeHead,
      format: formatNumber,
    },
    {
      label: "정규직(시간)",
      values: resources.fulltimeHours,
      format: formatNumber,
    },
    {
      label: "프리랜서(시간)",
      values: resources.freelancerHours,
      format: formatNumber,
    },
  ];

  type TableRow = {
    label: string;
    ytd: string;
    [key: string]: string;
  };

  const rows: TableRow[] = tableData.map((item) => {
    const row: TableRow = {
      label: item.label,
      ytd: item.format(item.values.ytd),
    };
    MONTH_KEYS.forEach((key, i) => {
      row[MONTHS_KO[i]] = item.format(item.values[key]);
    });
    return row;
  });

  const columns = [
    { key: "label", header: "항목" },
    { key: "ytd", header: "YTD", align: "right" as const },
    ...MONTHS_KO.map((m) => ({
      key: m,
      header: m,
      align: "right" as const,
    })),
  ];

  return (
    <div className="space-y-6">
      <Header title="리소스" description="인력 및 리소스 현황 (1-3월 실적, 4-12월 전망)" />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="총 투입 시간 (연간누계)"
          value={`${formatNumber(resources.totalHours.ytd)}시간`}
        />
        <SummaryCard
          title="정규직"
          value={`${formatNumber(resources.fulltimeHead.ytd)}명`}
        />
        <SummaryCard
          title="시간당 공헌이익"
          value={formatKRW(resources.cmPerHour.ytd)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartWrapper
          title="투입 시간 (정규직 vs 프리랜서)"
          description="월별 정규직/프리랜서 투입 시간"
        >
          <ResourceHoursChart data={hoursData} />
        </ChartWrapper>

        <ChartWrapper
          title="정규직 인원 추이"
          description="월별 정규직 인원 변화"
        >
          <HeadcountTrend data={headcountData} />
        </ChartWrapper>
      </div>

      <ChartWrapper
        title="시간당 공헌이익 추이"
        description="월별 시간당 공헌이익 변화"
      >
        <CMPerHourChart data={cmPerHourData} />
      </ChartWrapper>

      <DataTable columns={columns} data={rows} caption="리소스 상세 데이터" />

      <p className="text-xs text-muted-foreground mt-8">
        * 1-3월 실적 데이터, 4-12월 전망 기준
      </p>
    </div>
  );
}
