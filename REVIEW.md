# Business Metrics Dashboard - Code Review

전수 조사 결과. 심각도 순으로 정리.

---

## CRITICAL - 반드시 수정

### 1. Revenue 페이지 Tabs value 타입 오류

`src/app/revenue/revenue-page-client.tsx:115-143`

shadcn Tabs 컴포넌트는 `value`에 **string**을 기대하는데, **number** (`0`, `1`)를 넘기고 있음.
탭 전환이 작동하지 않을 수 있음.

```tsx
// 현재 (잘못됨)
<Tabs defaultValue={0}>
  <TabsTrigger value={0}>고객별</TabsTrigger>
  <TabsTrigger value={1}>패키지별</TabsTrigger>
  <TabsContent value={0}>...</TabsContent>
  <TabsContent value={1}>...</TabsContent>

// 수정
<Tabs defaultValue="clients">
  <TabsTrigger value="clients">고객별</TabsTrigger>
  <TabsTrigger value="packages">패키지별</TabsTrigger>
  <TabsContent value="clients">...</TabsContent>
  <TabsContent value="packages">...</TabsContent>
```

### 2. 차트 컴포넌트 대부분 ResponsiveContainer 누락

`ChartWrapper`만 `ResponsiveContainer`를 감싸고 있는데, 일부 차트는 `ChartWrapper` 안에서 렌더링되고 일부는 아님. **`ChartWrapper` 밖에서 직접 렌더되는 차트는 고정 크기로 렌더링됨.** 모바일/태블릿에서 overflow 발생.

영향 받는 파일 (ChartWrapper 안에서 사용되지만, BarChart/LineChart 자체에 width/height 미지정):
- `src/components/dashboard/client-revenue-bar.tsx` - width 없음
- `src/components/dashboard/client-revenue-stacked.tsx` - width 없음
- `src/components/dashboard/cost-client-bar.tsx` - width 없음
- `src/components/dashboard/cost-package-bar.tsx` - width 없음
- `src/components/dashboard/operation-cost-breakdown.tsx` - width 없음
- `src/components/dashboard/resource-hours-chart.tsx` - width 없음
- `src/components/dashboard/headcount-trend.tsx` - width 없음
- `src/components/dashboard/cm-per-hour-chart.tsx` - width 없음
- `src/components/dashboard/package-donut.tsx` - width 없음
- `src/components/dashboard/package-trend.tsx` - width 없음

`ChartWrapper`의 `ResponsiveContainer`가 자식 차트에 width/height를 주입하므로 대부분 동작은 하지만, Recharts 공식 문서 기준으로 **chart 컴포넌트 자체에 `width`와 `height`를 0으로 설정하지 않으면 ResponsiveContainer가 제대로 작동하지 않을 수 있음.**

### 3. Client Detail 페이지 non-null assertion 위험

`src/app/clients/[slug]/page.tsx:33-35`

```tsx
const clientRevenue = data.revenueByClient.find(
  (c) => c.name === clientName
)!;  // clientName이 존재하더라도 find()가 undefined 반환 가능
```

`deslugify()`가 성공했으므로 이론상 안전하지만, `costByClient`에만 있고 `revenueByClient`에는 없는 클라이언트(Gitlab, VIVI)의 경우 `slugify("Gitlab")`로 접근하면 **런타임 크래시** 발생.

---

## HIGH - 데이터 정합성 문제

### 4. Revenue 클라이언트와 Cost 클라이언트 리스트 불일치

`src/lib/parse-pnl.ts:54-57` vs `src/lib/parse-pnl.ts:82-85`

Revenue 클라이언트: 12개 (Gitlab 없음, VIVI 없음)
Cost 클라이언트: 14개 (Gitlab 있음, VIVI 있음)

CSV 원본 데이터에서:
- Gitlab은 비용만 있고 매출이 없음 (row 56)
- VIVI는 비용만 있고 매출 클라이언트에는 없음 (매출은 패키지별에만 존재)

이로 인해:
- `/clients/gitlab` 경로 접근 불가 (revenueByClient에 없어서 slug 매칭 실패)
- VIVI 클라이언트 상세 페이지에서 매출 0으로 표시
- Cost 페이지에서 Gitlab/VIVI 비용이 보이지만 Revenue 페이지에서 해당 클라이언트 링크 없음

### 5. CLIENT_COLORS에 Gitlab 누락

`src/lib/constants.ts:7-21`

`costByClient`에 Gitlab이 포함되어 있지만 `CLIENT_COLORS`에 Gitlab 색상이 없음. Cost 페이지의 클라이언트별 차트에서 Gitlab 바가 색상 없이 렌더링될 수 있음.

### 6. CSV 파서 최소 행 수 검증 없음

`src/lib/parse-pnl.ts:39-41`

```tsx
export function parsePNLFromRows(rows: string[][]): PNLData {
  const r = (n: number) => rows[n - 1] ?? [];
```

CSV가 빈 파일이거나 행이 부족해도 에러 없이 전부 0으로 채워진 데이터 반환. 78행 이상인지 최소한 체크해야 함.

### 7. Google Sheets API 에러 핸들링 없음

`src/lib/google-sheets.ts:18-24`

API 호출 실패 시(네트워크 에러, 인증 실패, 시트 없음) try-catch 없이 에러가 그대로 전파됨. `/api/sheets` 엔드포인트에서 generic 500 에러만 반환.

---

## MEDIUM - UX/구조 문제

### 8. error.tsx 전무

모든 페이지에 에러 바운더리 없음:
- `src/app/error.tsx` - 없음
- `src/app/revenue/error.tsx` - 없음
- `src/app/cost/error.tsx` - 없음
- `src/app/resources/error.tsx` - 없음

`getPNLData()` 실패 시 Next.js 기본 에러 페이지 노출.

### 9. loading.tsx 불완전

- `src/app/loading.tsx` - 있음 (홈)
- `src/app/clients/[slug]/loading.tsx` - 있음
- `src/app/revenue/loading.tsx` - **없음**
- `src/app/cost/loading.tsx` - **없음**
- `src/app/resources/loading.tsx` - **없음**

### 10. 빈 데이터(empty state) 처리 없음

- `DataTable`: data가 빈 배열이면 빈 테이블 렌더링 (헤더만 남음, "데이터 없음" 안내 없음)
- 차트 컴포넌트: 데이터가 전부 0이어도 빈 차트 렌더링
- 클라이언트 상세: 매출 0, 비용 0인 클라이언트도 그대로 표시

### 11. 운영비 카테고리명 영어

`src/components/dashboard/operation-cost-breakdown.tsx`

```tsx
<Bar dataKey="project" name="Project Operation" fill="#3B82F6" />
<Bar dataKey="product" name="Product Operation" fill="#10B981" />
<Bar dataKey="software" name="Software Subscription" fill="#F59E0B" />
```

대시보드 전체가 한국어인데 이 부분만 영어. "프로젝트 운영", "프로덕트 운영", "소프트웨어 구독"으로 변경 필요.

### 12. CLIENT_COLORS 폴백 없음

`src/app/clients/[slug]/page.tsx:89`

```tsx
const clientColor = CLIENT_COLORS[clientName];  // undefined 가능
```

`FALLBACK_COLOR`가 constants.ts에 정의되어 있지만 사용되지 않음. Revenue 페이지 클라이언트에서는 FALLBACK_COLOR를 쓰지만 Client Detail에서는 안 씀.

### 13. Cost 페이지 타입 안전성

`src/app/cost/page.tsx`

`as unknown as Record<string, unknown>[]` 패턴으로 타입을 우회. DataTable의 제네릭 타입과 맞지 않아서 발생한 문제. DataTable의 `T extends Record<string, unknown>` 제약이 너무 엄격.

---

## LOW - 개선 사항

### 14. CSV 파서 따옴표 이스케이프 미지원

`src/lib/csv.ts:7-9`

RFC 4180 기준, 따옴표 안의 `""` (이스케이프된 따옴표)를 처리하지 않음. 현재 CSV 데이터에는 해당 케이스 없지만, 구글시트 연동 시 발생 가능.

### 15. 클라이언트 이름 하드코딩

`src/lib/parse-pnl.ts:54-57, 63, 82-85`

4개의 별도 배열로 클라이언트/패키지 이름 관리. CSV 구조가 변경되면 모두 수동으로 맞춰야 함. CSV에서 이름을 직접 파싱하는 것이 더 안전.

### 16. 캐시 TTL 환경변수화

`src/lib/cache.ts:8`

5분 TTL이 하드코딩. `CACHE_TTL_MS` 환경변수로 설정 가능하게 하면 유연.

### 17. Tooltip 포맷 불일치

일부 차트는 `ChartTooltip` 공유 컴포넌트 사용, 일부는 인라인 `formatter` 사용, 일부는 기본 Tooltip 사용. KRW 포맷팅이 일관되지 않음.

### 18. 접근성(a11y) 부재

- 차트에 `aria-label` 없음
- 색상 구분에만 의존 (색맹 사용자 고려 안 됨)
- 키보드 네비게이션 차트에서 불가

### 19. slugify 함수 중복 정의

`src/lib/slugify.ts`가 Revenue 에이전트와 Client Detail 에이전트가 각각 생성. 머지 시 충돌 해결했지만, Revenue 페이지의 서버 컴포넌트(`src/app/revenue/page.tsx`)에서도 별도 slugify 로직이 있을 수 있음. 확인 필요.

### 20. `formatKRWFull` 음수 처리

`src/lib/format.ts:23-25`

```tsx
export function formatKRWFull(n: number): string {
  return n.toLocaleString('en-US');
}
```

`toLocaleString('en-US')`는 음수를 `-1,234`로 포맷하므로 동작하지만, 한국어 관행상 `△1,234` 또는 `(1,234)` 표기를 쓸 수도 있음.

---

## 우선순위 정리

| # | 심각도 | 요약 | 파일 |
|---|--------|------|------|
| 1 | CRITICAL | Tabs value 타입 오류 (number → string) | revenue-page-client.tsx |
| 2 | CRITICAL | 차트 ResponsiveContainer/크기 미지정 | 10개 차트 컴포넌트 |
| 3 | CRITICAL | non-null assertion 런타임 크래시 위험 | clients/[slug]/page.tsx |
| 4 | HIGH | Revenue/Cost 클라이언트 리스트 불일치 | parse-pnl.ts |
| 5 | HIGH | Gitlab 색상 누락 | constants.ts |
| 6 | HIGH | CSV 최소 행 수 검증 없음 | parse-pnl.ts |
| 7 | HIGH | Google Sheets API 에러 핸들링 없음 | google-sheets.ts |
| 8 | MEDIUM | error.tsx 전무 | app/ |
| 9 | MEDIUM | loading.tsx 3개 페이지 누락 | app/ |
| 10 | MEDIUM | empty state 처리 없음 | 전체 |
| 11 | MEDIUM | 운영비 카테고리명 영어 | operation-cost-breakdown.tsx |
| 12 | MEDIUM | CLIENT_COLORS 폴백 미사용 | clients/[slug]/page.tsx |
| 13 | MEDIUM | 타입 우회 (as unknown as) | cost/page.tsx |
| 14 | LOW | CSV 파서 따옴표 이스케이프 | csv.ts |
| 15 | LOW | 클라이언트 이름 하드코딩 | parse-pnl.ts |
| 16 | LOW | 캐시 TTL 하드코딩 | cache.ts |
| 17 | LOW | Tooltip 포맷 불일치 | 차트 컴포넌트들 |
| 18 | LOW | 접근성 부재 | 차트 컴포넌트들 |
| 19 | LOW | slugify 중복 가능성 | slugify.ts |
| 20 | LOW | formatKRWFull 음수 표기 | format.ts |
