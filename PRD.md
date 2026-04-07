# PRD: Business Metrics Dashboard - Quality Overhaul

## Context

BubbleShare 사내 비즈니스 메트릭스 대시보드 v1이 구현됨. 3개 전문 감사(UI Design, UX Usability, Dev Quality)를 통해 **총 52개 이슈**를 발견. 이 PRD는 이슈를 6개 독립 작업 단위(Work Unit)로 분류하여 **에이전트 팀이 병렬로** 처리할 수 있도록 구조화함.

---

## Issue Registry (전체 이슈 목록)

### CRITICAL (즉시 수정)

| ID | 영역 | 이슈 | 파일 | 작업단위 |
|----|------|------|------|----------|
| C1 | Dev | Tabs value 타입 오류 (number → string) | revenue-page-client.tsx:115 | WU-1 |
| C2 | Dev | non-null assertion 런타임 크래시 위험 | clients/[slug]/page.tsx:35 | WU-1 |
| C3 | UX | 모바일 네비게이션 없음 (sidebar hidden) | sidebar.tsx:19, layout.tsx:33 | WU-2 |
| C4 | Design | 하드코딩된 차트 색상 (다크모드 미대응) | 10개 차트 컴포넌트 | WU-3 |

### HIGH (높은 우선순위)

| ID | 영역 | 이슈 | 파일 | 작업단위 |
|----|------|------|------|----------|
| H1 | Dev | Google Sheets API 에러 핸들링 없음 | google-sheets.ts:6-30 | WU-1 |
| H2 | Dev | CSV 최소 행 수 검증 없음 | parse-pnl.ts:39 | WU-1 |
| H3 | Dev | Revenue/Cost 클라이언트 리스트 불일치 | parse-pnl.ts:54-85 | WU-1 |
| H4 | Dev | error.tsx 전무 (에러 바운더리 없음) | app/ 전체 | WU-4 |
| H5 | Dev | as unknown as 타입 우회 | cost/page.tsx:145,154,163 | WU-1 |
| H6 | UX | loading.tsx 3개 페이지 누락 | revenue/, cost/, resources/ | WU-4 |
| H7 | UX | 실적 vs 전망 시각적 구분 불명확 | revenue-trend-chart.tsx | WU-3 |
| H8 | UX | KRW 포맷 페이지간 불일치 | format.ts, 각 페이지 | WU-5 |
| H9 | UX | 테이블 모바일 스크롤 표시 없음 | data-table.tsx, 각 페이지 | WU-2 |
| H10 | UX | 클라이언트 상세 → 뒤로가기 링크 없음 | clients/[slug]/page.tsx | WU-2 |
| H11 | Design | 차트 마진 불일치 (left: 0~80px) | 차트 컴포넌트들 | WU-3 |
| H12 | Design | Gitlab 색상 누락 (CLIENT_COLORS) | constants.ts | WU-1 |

### MEDIUM (중간 우선순위)

| ID | 영역 | 이슈 | 파일 | 작업단위 |
|----|------|------|------|----------|
| M1 | UX | empty state 처리 없음 | DataTable, 차트 전체 | WU-4 |
| M2 | UX | 데이터 기준 시점 표시 없음 (YTD 컨텍스트) | 모든 페이지 | WU-5 |
| M3 | UX | CM/Hour 등 메트릭 설명 없음 | page.tsx, resources/ | WU-5 |
| M4 | UX | 메트릭 용어 페이지간 불일치 | 전체 | WU-5 |
| M5 | UX | 음수 값 시각적 구분 없음 (빨간색 등) | format.ts, 전체 | WU-5 |
| M6 | UX | 차트 범례 모바일 가독성 | 차트 컴포넌트들 | WU-3 |
| M7 | Design | 운영비 카테고리명 영어 | operation-cost-breakdown.tsx | WU-5 |
| M8 | Design | CLIENT_COLORS 폴백 미사용 | clients/[slug]/page.tsx:89 | WU-1 |
| M9 | Design | 사이드바 반응형 불완전 | sidebar.tsx, layout.tsx | WU-2 |
| M10 | Design | 테이블 헤더 다크모드 구분 약함 | table.tsx | WU-3 |
| M11 | Design | 카드 title 계층 불일치 (sm/base/2xl) | summary-card, chart-wrapper | WU-3 |
| M12 | Design | 로딩 스켈레톤 높이 불일치 | loading.tsx | WU-4 |
| M13 | Dev | API route 에러 로깅 부족 | api/sheets/route.ts | WU-1 |
| M14 | Dev | SummaryCard "use client" 불필요 | summary-card.tsx | WU-6 |
| M15 | Dev | MONTH_KEYS 여러 파일에 중복 정의 | resources/page.tsx, cost/page.tsx | WU-6 |
| M16 | Dev | ESLint 설정 없음 | 프로젝트 루트 | WU-6 |
| M17 | Dev | 테스트 코드 전무 | 전체 | WU-6 |

### LOW (낮은 우선순위)

| ID | 영역 | 이슈 | 파일 | 작업단위 |
|----|------|------|------|----------|
| L1 | Dev | CSV 파서 따옴표 이스케이프 미지원 | csv.ts | WU-6 |
| L2 | Dev | 캐시 TTL 하드코딩 | cache.ts | WU-6 |
| L3 | Dev | parseNumber 디버깅 불가 | parse-pnl.ts | WU-6 |
| L4 | UX | 접근성 (ARIA, 키보드, 색맹) | 차트 전체 | WU-3 |
| L5 | UX | 테이블 정렬 기능 없음 | data-table.tsx | WU-2 |
| L6 | UX | 검색/필터 기능 없음 | revenue 페이지 | WU-2 |
| L7 | UX | 차트/테이블 내보내기 기능 없음 | 전체 | - (v2) |
| L8 | UX | 날짜 범위 선택 없음 | 전체 | - (v2) |
| L9 | Design | 차트 GridLine 불일치 | 차트 컴포넌트들 | WU-3 |
| L10 | Design | 링크 스타일 불일치 | revenue-page-client.tsx:74 | WU-3 |

---

## Work Units (병렬 작업 단위)

### 의존성 그래프

```
WU-1 (Data/Type Fixes)  ─────────────┐
WU-2 (Navigation/Mobile) ────────────┤
WU-3 (Chart/Visual System) ──────────┤── 모두 독립, 병렬 실행 가능
WU-4 (Error/Loading/Empty States) ───┤
WU-5 (Content/Format/i18n) ──────────┤
WU-6 (Code Quality/Infra) ──────────┘
```

**핵심: 6개 작업 단위는 서로 다른 파일을 수정하므로 머지 충돌 없이 병렬 실행 가능.**

---

### WU-1: Data Layer & Type Safety Fixes

**담당**: Backend/Data 전문 에이전트
**이슈**: C1, C2, H1, H2, H3, H5, H12, M8, M13
**수정 파일**:
- `src/lib/google-sheets.ts` — try-catch 추가, Sheets→CSV 폴백
- `src/lib/parse-pnl.ts` — 최소 행 수 검증, 클라이언트 리스트 정리
- `src/lib/constants.ts` — Gitlab 색상 추가
- `src/app/api/sheets/route.ts` — 에러 로깅 개선
- `src/app/revenue/revenue-page-client.tsx` — Tabs value string 변환
- `src/app/cost/page.tsx` — as unknown as 제거, 적절한 타입 사용
- `src/app/clients/[slug]/page.tsx` — non-null assertion → 명시적 null 체크, FALLBACK_COLOR 사용

**구체적 작업**:
1. `google-sheets.ts`: 전체 함수를 try-catch로 감싸고, Sheets API 실패 시 CSV 폴백 추가
2. `parse-pnl.ts:39`: `rows.length < 78`이면 Error throw
3. `parse-pnl.ts:54-85`: costByClient에 Gitlab/VIVI가 있으므로 revenueByClient에도 Gitlab 추가하거나, 둘 다 CSV에서 동적으로 파싱
4. `constants.ts`: `CLIENT_COLORS`에 `'Gitlab': '#FC6D26'` 추가
5. `revenue-page-client.tsx:115`: `defaultValue={0}` → `defaultValue="clients"`, 모든 value를 string으로
6. `cost/page.tsx:145,154,163`: `as unknown as` 제거, DataTable 제네릭 타입 조정
7. `clients/[slug]/page.tsx:33-35`: `!` 제거, null check 후 `notFound()` 호출
8. `clients/[slug]/page.tsx:89`: `CLIENT_COLORS[clientName] ?? FALLBACK_COLOR`
9. `api/sheets/route.ts`: dev 환경에서 에러 상세 반환

**머지 충돌 방지**: 이 WU만 lib/, api/, types/ 파일을 수정. 다른 WU는 이 파일들을 수정하지 않음.

---

### WU-2: Navigation, Mobile & Interaction

**담당**: Frontend/Interaction 전문 에이전트
**이슈**: C3, H9, H10, M9, L5, L6
**수정 파일**:
- `src/components/layout/sidebar.tsx` — 모바일 햄버거 메뉴 추가
- `src/components/layout/mobile-nav.tsx` — **신규** 모바일 네비게이션 컴포넌트
- `src/app/layout.tsx` — 모바일 레이아웃 조정
- `src/components/dashboard/data-table.tsx` — 스크롤 표시, 첫 열 고정
- `src/app/clients/[slug]/page.tsx` — 뒤로가기 링크 추가 (헤더 부분만)

**구체적 작업**:
1. `mobile-nav.tsx` 신규 생성: Sheet/Drawer 패턴의 모바일 메뉴
   - 햄버거 버튼 (md:hidden)
   - 오버레이 + 슬라이드 사이드바
   - 동일한 navItems 사용
2. `sidebar.tsx`: 데스크탑 전용 유지 (`hidden md:flex`)
3. `layout.tsx`: MobileNav를 main 영역 상단에 배치
4. `data-table.tsx`: 
   - 첫 번째 열 `sticky left-0 bg-background z-10`
   - 우측 스크롤 그라데이션 표시
   - `overflow-x-auto` 래퍼 내장
5. `clients/[slug]/page.tsx`: Header 위에 `← 매출 목록` 링크 추가

**머지 충돌 방지**: layout/ 컴포넌트와 data-table.tsx만 수정. WU-1이 clients/[slug]/page.tsx도 수정하지만, WU-1은 데이터 로직(33-35행, 89행), WU-2는 JSX 상단(92행 위)만 수정하므로 충돌 없음.

---

### WU-3: Chart Visual System & Design Consistency

**담당**: Design/Chart 전문 에이전트
**이슈**: C4, H7, H11, M6, M10, M11, L4, L9, L10
**수정 파일**:
- `src/components/dashboard/revenue-trend-chart.tsx` — 색상 체계, 실적/전망 구분 강화
- `src/components/dashboard/revenue-vs-goal-chart.tsx` — 색상 체계
- `src/components/dashboard/client-revenue-bar.tsx` — 마진 통일, GridLine
- `src/components/dashboard/client-revenue-stacked.tsx` — 마진 통일, GridLine
- `src/components/dashboard/package-donut.tsx` — 접근성
- `src/components/dashboard/package-trend.tsx` — 실적/전망 구분
- `src/components/dashboard/cost-client-bar.tsx` — 마진 통일, GridLine
- `src/components/dashboard/cost-package-bar.tsx` — 마진 통일
- `src/components/dashboard/operation-cost-breakdown.tsx` — 마진 통일
- `src/components/dashboard/resource-hours-chart.tsx` — 마진 통일
- `src/components/dashboard/headcount-trend.tsx` — 마진 통일
- `src/components/dashboard/cm-per-hour-chart.tsx` — 마진 통일
- `src/components/dashboard/client-margin-chart.tsx` — 색상 체계
- `src/components/dashboard/chart-tooltip.tsx` — 통일된 툴팁
- `src/components/dashboard/summary-card.tsx` — trend 아이콘 크기
- `src/components/ui/table.tsx` — 다크모드 헤더 강화

**구체적 작업**:
1. **차트 표준 상수** 정의 (chart-config.ts 신규):
   ```ts
   export const CHART_MARGIN = { left: 60, right: 30, top: 20, bottom: 20 };
   export const CHART_COLORS = { revenue: 'var(--chart-1)', goal: 'var(--chart-2)', ... };
   ```
2. 모든 차트에 `CartesianGrid strokeDasharray="3 3"` 추가 (도넛 제외)
3. 모든 차트에 통일된 margin 적용
4. 실적/전망 구분: 색상+패턴+범례 라벨로 3중 구분
5. `summary-card.tsx`: trend 아이콘 h-3→h-4, w-3→w-4
6. `table.tsx`: 헤더에 `dark:bg-muted/50 dark:border-b-2` 추가
7. 모든 차트에 `ChartTooltip` 공유 컴포넌트 사용으로 통일
8. 접근성: 차트 래퍼에 `role="img" aria-label` 추가

**머지 충돌 방지**: 차트 컴포넌트와 UI 컴포넌트만 수정. 다른 WU는 이 파일들을 수정하지 않음.

---

### WU-4: Error Boundaries, Loading & Empty States

**담당**: Frontend/UX 전문 에이전트
**이슈**: H4, H6, M1, M12
**신규 파일**:
- `src/app/error.tsx` — 글로벌 에러 바운더리
- `src/app/not-found.tsx` — 404 페이지
- `src/app/revenue/loading.tsx` — Revenue 로딩 스켈레톤
- `src/app/cost/loading.tsx` — Cost 로딩 스켈레톤
- `src/app/resources/loading.tsx` — Resources 로딩 스켈레톤
- `src/components/dashboard/empty-state.tsx` — 빈 데이터 상태 컴포넌트

**수정 파일**:
- `src/app/loading.tsx` — 스켈레톤 높이 조정

**구체적 작업**:
1. `error.tsx`: "use client", 에러 메시지 + 다시 시도 버튼, 한국어 UI
2. `not-found.tsx`: "페이지를 찾을 수 없습니다" + 홈으로 가기 링크
3. 각 페이지 `loading.tsx`: 해당 페이지 레이아웃에 맞는 스켈레톤 (카드 수, 차트 위치 등)
4. `empty-state.tsx`: "데이터가 없습니다" 아이콘 + 메시지, 재사용 가능한 컴포넌트
5. `loading.tsx` 기존 파일: 스켈레톤 높이를 실제 컴포넌트와 맞춤

**머지 충돌 방지**: 모두 신규 파일이거나, 기존 loading.tsx만 수정. 다른 WU와 겹치지 않음.

---

### WU-5: Content, Formatting & Localization

**담당**: Content/i18n 전문 에이전트
**이슈**: H8, M2, M3, M4, M5, M7
**수정 파일**:
- `src/lib/format.ts` — 음수 스타일링 헬퍼, 포맷 일관성
- `src/app/page.tsx` — YTD 컨텍스트 표시, 메트릭 한국어 설명
- `src/app/revenue/page.tsx` — YTD 컨텍스트 표시
- `src/app/cost/page.tsx` — YTD 컨텍스트, 운영비 한국어화 (JSX 텍스트만)
- `src/app/resources/page.tsx` — 메트릭 설명, 용어 통일

**구체적 작업**:
1. `format.ts`: `formatKRWStyled(n)` 함수 추가 — `{ text: string, isNegative: boolean }` 반환
2. 모든 페이지 Header description에 "1-3월 실적, 4-12월 전망 기준" 추가
3. `page.tsx`: CM/Hour → "시간당 공헌이익 (CM/Hour)" 형태로 한국어 설명 병기
4. 메트릭 용어 통일: "공헌이익" = Contribution Margin, "마진" = Cost margin 등
5. 각 페이지 하단에 `* 1-3월 실적 데이터, 4-12월 전망` 푸터 추가
6. `cost/page.tsx`: 운영비 차트 데이터 전달 시 한국어 라벨 사용

**머지 충돌 방지**: 페이지 파일의 JSX 텍스트/Header props만 수정. WU-1은 데이터 로직, WU-5는 표시 텍스트만 수정하므로 충돌 최소화. cost/page.tsx는 WU-1(타입 수정 145행)과 WU-5(텍스트 수정 다른 행)로 분리.

---

### WU-6: Code Quality & Infrastructure

**담당**: DevOps/Quality 전문 에이전트
**이슈**: M14, M15, M16, M17, L1, L2, L3
**수정 파일**:
- `src/components/dashboard/summary-card.tsx` — "use client" 제거 가능 여부 확인
- `src/app/resources/page.tsx` — 중복 monthKeys 제거, import로 대체
- `src/lib/csv.ts` — 따옴표 이스케이프 지원
- `src/lib/cache.ts` — TTL 환경변수화
- `src/lib/parse-pnl.ts` — parseNumber에 경고 로깅 추가

**신규 파일**:
- `eslint.config.mjs` — ESLint flat config
- `src/__tests__/format.test.ts` — 포맷 함수 테스트
- `src/__tests__/parse-pnl.test.ts` — CSV 파싱 테스트
- `src/__tests__/slugify.test.ts` — slugify 테스트

**구체적 작업**:
1. ESLint flat config 생성 (next/core-web-vitals 기반)
2. 중복 `monthKeys` 정의 제거, `MONTH_KEYS` import 사용
3. `csv.ts`: `""` 이스케이프 처리 추가
4. `cache.ts`: `process.env.CACHE_TTL_MS` 지원
5. `parse-pnl.ts`: parseNumber에 field context 파라미터 추가
6. 핵심 유틸리티 테스트 작성 (bun test 사용)
7. `summary-card.tsx`: "use client" 필요 여부 확인 (lucide-react 아이콘이 client 필요)

**머지 충돌 방지**: 인프라/테스트 파일은 신규. 기존 파일 수정은 lib/ 유틸리티 내부 로직만 변경 (WU-1의 parse-pnl.ts 수정과 겹칠 수 있으나, WU-1은 parsePNLFromRows 함수 상단에 검증 추가, WU-6은 parseNumber 함수 수정으로 분리 가능).

---

## Execution Plan (실행 계획)

### Phase 1: 6개 에이전트 병렬 실행

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION                            │
│                                                                  │
│  [WU-1] Data/Type ──────────────────────────────────> commit    │
│  [WU-2] Nav/Mobile ─────────────────────────────────> commit    │
│  [WU-3] Chart/Visual ───────────────────────────────> commit    │
│  [WU-4] Error/Loading ──────────────────────────────> commit    │
│  [WU-5] Content/i18n ───────────────────────────────> commit    │
│  [WU-6] Quality/Infra ─────────────────────────────> commit    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: 머지 & 검증

1. 각 브랜치를 main에 순차 머지 (충돌 해결)
2. `bun run build` 빌드 검증
3. `bun run dev`로 전체 페이지 수동 확인

### Phase 3: 통합 테스트

1. 모든 페이지 렌더링 확인
2. 모바일 뷰포트 네비게이션 확인
3. 차트 데이터 정합성 확인
4. 에러 시나리오 테스트

---

## Verification Checklist (검증 체크리스트)

### WU-1 검증
- [ ] Revenue 페이지 탭 전환 동작
- [ ] Client Detail 페이지 `/clients/gitlab` 접근 시 정상 동작
- [ ] Google Sheets 연결 실패 시 CSV 폴백 동작
- [ ] 빈 CSV 파일로 테스트 시 에러 메시지 표시

### WU-2 검증
- [ ] 모바일(375px)에서 햄버거 메뉴 표시
- [ ] 메뉴 열기/닫기 동작
- [ ] 테이블 첫 열 고정, 가로 스크롤 동작
- [ ] Client Detail에서 "← 매출 목록" 링크 동작

### WU-3 검증
- [ ] 다크모드에서 모든 차트 가독성
- [ ] 모든 차트 마진/GridLine 통일
- [ ] 실적/전망 구분이 시각적으로 명확
- [ ] 툴팁 KRW 포맷 통일

### WU-4 검증
- [ ] getPNLData() 실패 시 에러 페이지 표시
- [ ] 존재하지 않는 URL 접근 시 404 페이지
- [ ] Revenue/Cost/Resources 페이지 로딩 스켈레톤 표시
- [ ] 빈 데이터 시 "데이터 없음" 메시지

### WU-5 검증
- [ ] 모든 페이지에 "1-3월 실적, 4-12월 전망" 컨텍스트 표시
- [ ] 음수 값 빨간색 표시
- [ ] 운영비 카테고리 한국어 표시
- [ ] 용어 통일: "공헌이익", "마진" 일관적 사용

### WU-6 검증
- [ ] `bun run lint` 통과
- [ ] `bun test` 통과 (format, parse-pnl, slugify)
- [ ] 중복 monthKeys 정의 없음
- [ ] CSV 파서 따옴표 이스케이프 테스트

---

## Out of Scope (v2 이후)

- L7: 차트/테이블 내보내기 (CSV, PNG)
- L8: 날짜 범위 선택기
- 실시간 데이터 업데이트 (WebSocket)
- 사용자 인증/권한
- 다국어 지원 (영어 등)
