# PRD: 대시보드 UX 리디자인

## Context
사용자와 논의하여 현재 대시보드의 정보 구조를 개선. 핵심: 불필요한 차트 제거, 관련 지표 그룹핑, 필터 기반 단일 차트로 통합, 그레이스케일 기반 시각 계층.

## 디자인 원칙

### 그레이스케일 정보 계층
```
■ 검정/진한색   → 실적/실제 값 (가장 먼저 눈에 들어옴)
■ 진회색        → 비용/지출
■ 중간 회색     → 목표/기준선 (배경처럼 깔림)
■ 연회색        → 전망/예측 (확정 안 된 값)
□ 아주 연한 회색 → 보조 정보, 라벨
```
강조색은 예외 상황에만 사용 (목표 미달 시 빨간색 등).

---

## 페이지별 변경사항

### WU-1: 홈 페이지 리디자인 (`/`)

**현재**: KPI 카드 4개 나열 + 차트 2개
**변경**: 지표를 의미 관계대로 그룹핑

```
수익성 그룹 (돈을 얼마나 남겼나)
├── 총 매출          12.7억  (YTD Projection: 50.9억)
├── 운영비용         1.9억
├── 공헌이익         10.8억  (= 매출 - 비용)
└── 공헌이익률       84.76%  (= 공헌이익 / 매출)

목표 달성 그룹 (계획 대비 얼마나 했나)
├── 매출 목표        8.2억
├── 목표 대비 차이   +4.5억  (= 매출 - 목표)
└── 목표 대비 %      +54.29%

효율성 그룹
└── CM/Hour          19만    (= 공헌이익 / 투입시간)
```

**차트**: 매출 추이 + 매출 vs 목표 유지하되 그레이스케일 적용
- 매출 바/라인: 진한색 (검정/차콜)
- 목표: 연한 회색 배경
- 전망(4-12월): 점선 + 연회색

**수정 파일**:
- `src/app/page.tsx` — 그룹핑 레이아웃으로 재구성
- `src/components/dashboard/revenue-trend-chart.tsx` — 그레이스케일 색상
- `src/components/dashboard/revenue-vs-goal-chart.tsx` — 그레이스케일 색상
- `src/lib/chart-config.ts` — 그레이스케일 SEMANTIC_COLORS 업데이트

---

### WU-2: 매출 페이지 통합 (`/revenue`)

**현재**: 고객별 탭 (가로 바 + 스택 바 + 테이블) / 패키지별 탭 (도넛 + 트렌드 + 테이블) = 차트 5개
**변경**: 필터 기반 단일 차트 + 테이블

```
[고객별 | 패키지별]  [지표: 매출 | 비용 | 마진 | CM]  [뷰: 비교 | 월별 추이]

┌──────────────────────────────────┐
│  필터에 따라 바뀌는 차트 1개       │
│  (비교=원형/바, 월별=라인/스택)    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  필터에 따라 바뀌는 테이블 1개     │
└──────────────────────────────────┘
```

- 기존 5개 차트 컴포넌트 → 1개 동적 차트 컴포넌트
- 비교 뷰에서 고객 클릭 → `/clients/[slug]` 이동
- 그레이스케일 기반 색상

**수정 파일**:
- `src/app/revenue/page.tsx` — 데이터 변환 로직 변경
- `src/app/revenue/revenue-page-client.tsx` — 필터 UI + 동적 차트 렌더링으로 전면 재작성
- 기존 차트 컴포넌트 5개 → 삭제 또는 통합:
  - `client-revenue-bar.tsx` → 삭제
  - `client-revenue-stacked.tsx` → 삭제
  - `package-donut.tsx` → 삭제
  - `package-trend.tsx` → 삭제
  - 신규: `unified-chart.tsx` (필터에 따라 바/라인/원형 전환)

---

### WU-3: 비용 페이지 리디자인 (`/cost`)

**현재**: 요약 카드 3개 + 탭 3개 (고객별 차트/패키지별 차트/운영비 차트) + 테이블
**변경**: 차트 제거, 항목별 랭킹 리스트로 대체 + 리소스(시간 투입) 흡수

```
비용 요약
├── 총 비용           5.6억
├── 프로젝트 직접비   1.7억
└── 운영비           1,975만

돈으로 나간 비용 (금액 순 랭킹)
1. Adobe KR      9,792만   프로젝트 직접비
2. Adobe APAC    5,966만   프로젝트 직접비
3. 프로젝트 운영  1,182만   운영비
4. ...

시간으로 투입한 비용
├── 총 투입시간    5,675시간
├── 정규직        5,225시간
└── 프리랜서        450시간
```

- 인원수(head) 제거 — 비용 관점에서 의미 없음
- 기존 차트 3개 삭제, 정렬된 비용 랭킹 테이블로 대체
- 리소스 페이지 내용을 비용 페이지로 흡수

**수정 파일**:
- `src/app/cost/page.tsx` — 전면 재작성 (탭/차트 제거, 랭킹 리스트)
- 기존 차트 컴포넌트 삭제:
  - `cost-client-bar.tsx` → 삭제
  - `cost-package-bar.tsx` → 삭제
  - `operation-cost-breakdown.tsx` → 삭제
- 신규: `cost-ranking-list.tsx` (금액 순 정렬 + 비율 바)

**리소스 페이지 처리**:
- `src/app/resources/page.tsx` → 삭제 (비용 페이지에 흡수)
- `resource-hours-chart.tsx` → 삭제
- `headcount-trend.tsx` → 삭제
- `cm-per-hour-chart.tsx` → 삭제 (CM/Hour는 목표 페이지에서 추적)
- `src/lib/constants.ts` NAV_ITEMS에서 '리소스' 제거

---

### WU-4: 목표 페이지 간결화 (`/goals`)

**현재**: 프로그레스 바 2개 + KPI 카드 4개 + 차트 + 테이블
**변경**: CM/Hour 하나에만 집중

```
CM/Hour 프로그레스: 19만 → 24만 (크게)

CM/Hour 월별 추이 차트 (1-3월 실적 + 4-6월 목표선)

효율화 아이템 테이블
```

- 공헌이익 프로그레스 바 제거 (CM/Hour의 결과값이라 중복)
- Q1 공헌이익 카드 제거 (홈에서 이미 보여줌)
- Q2 공헌이익 카드 제거 (전망치라 의미 없음)
- 효율화 절감 시간 카드 → 테이블 헤더에 통합

**수정 파일**:
- `src/app/goals/page.tsx` — 카드/프로그레스 정리

---

## 에이전트 팀 구성

### 의존성

```
WU-1 (홈)     ─── chart-config.ts 색상 변경 포함, 먼저 실행
WU-2 (매출)   ─── WU-1 이후 (chart-config 의존)
WU-3 (비용)   ─── WU-1 이후 (chart-config 의존, 리소스 페이지 삭제 + NAV_ITEMS 변경)
WU-4 (목표)   ─── WU-1 이후 (chart-config 의존)
```

WU-1을 먼저, WU-2/3/4를 병렬로 실행.

다만 WU-3이 NAV_ITEMS와 리소스 페이지를 삭제하므로, WU-3이 constants.ts를 수정. 다른 WU는 constants.ts를 읽기만 함 → 충돌 없음.

```
Phase 1: [WU-1 홈 + chart-config]
Phase 2: [WU-2 매출] + [WU-3 비용+리소스] + [WU-4 목표]  (병렬)
```

| 에이전트 | Phase | 수정 파일 | 삭제 파일 |
|---------|-------|----------|----------|
| `home-redesign` | 1 | page.tsx, chart-config.ts, revenue-trend-chart.tsx, revenue-vs-goal-chart.tsx | — |
| `revenue-unify` | 2 | revenue/page.tsx, revenue-page-client.tsx, unified-chart.tsx(신규) | client-revenue-bar, client-revenue-stacked, package-donut, package-trend |
| `cost-redesign` | 2 | cost/page.tsx, cost-ranking-list.tsx(신규), constants.ts(NAV_ITEMS) | cost-client-bar, cost-package-bar, operation-cost-breakdown, resources/page.tsx, resource-hours-chart, headcount-trend, cm-per-hour-chart, resources/loading.tsx |
| `goals-simplify` | 2 | goals/page.tsx | — |

## Verification
1. `bun run build` 빌드 성공
2. `bun run dev` → 각 페이지 스크린샷 확인
3. 홈: 3그룹 카드 + 그레이스케일 차트
4. 매출: 필터 전환 동작 (고객/패키지 × 매출/비용/마진 × 비교/추이)
5. 비용: 랭킹 리스트 + 시간 투입 섹션, 차트 없음
6. 목표: CM/Hour 프로그레스 + 차트 + 아이템 테이블만
7. 리소스 페이지 삭제 확인 (/resources → 404)
8. 사이드바에서 리소스 메뉴 제거 확인
