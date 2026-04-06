# Business Metrics Dashboard - Implementation Plan

## Context

BubbleShare 팀의 재무 PNL 데이터가 구글시트에 있는데, 일반 팀원이 이해하기 어려움. 차트/시각화가 포함된 사내용 풀스택 대시보드를 만들어서 팀원 누구나 쉽게 매출, 비용, 마진, 목표 달성률을 확인할 수 있게 한다.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14+ (App Router) | 풀스택, SSR, API Routes |
| Language | TypeScript | 재무 데이터 타입 안정성 |
| UI | shadcn/ui + Tailwind CSS | 가볍고 커스텀 쉬움 |
| Charts | Recharts | React 네이티브, KRW 포맷팅 용이 |
| Data | Google Sheets API v4 + Service Account | 내부 도구라 OAuth 불필요 |
| Cache | In-memory LRU (5분 TTL) | Sheets API 부하 방지 |
| Font | Pretendard | 한국어 UI |
| Package Manager | pnpm | 빠르고 효율적 |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Pretendard, 사이드바)
│   ├── page.tsx                # 홈: Summary 대시보드
│   ├── revenue/page.tsx        # 매출 상세 (고객별/패키지별 탭)
│   ├── cost/page.tsx           # 비용 상세 (고객별/패키지별/운영비 탭)
│   ├── resources/page.tsx      # 인력/리소스
│   ├── clients/[slug]/page.tsx # 클라이언트별 상세
│   └── api/sheets/route.ts     # Google Sheets 데이터 API
├── components/
│   ├── layout/                 # sidebar, header
│   ├── dashboard/              # summary-cards, charts, data-table
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── google-sheets.ts        # Sheets API 클라이언트
│   ├── parse-pnl.ts            # 원시 데이터 → 타입 변환
│   ├── cache.ts                # LRU 캐시
│   ├── format.ts               # KRW 포맷 (12.7억, 4,286만)
│   └── constants.ts            # 한국어 월명, 클라이언트 색상
└── types/
    └── pnl.ts                  # PNLData 인터페이스
```

## Data Flow

```
Google Sheets → google-sheets.ts (fetch) → parse-pnl.ts (parse) → cache.ts (5min TTL)
                                                                        ↓
                                                    Server Components (SSR)  +  /api/sheets (client fetch)
                                                                        ↓
                                                    Dashboard Pages + Recharts (client components)
```

## Pages

### 1. Home (`/`) - Summary
- KPI 카드 4개: Total Revenue(YTD), Contribution Margin(YTD+%), Goal Diff(YTD), CM/Hour
- 월별 매출 추이: 실적(1-3월 solid) vs 전망(4-12월 dashed) vs 목표(line)
- Revenue vs Goal 비교 바 차트

### 2. Revenue (`/revenue`)
- 탭: 고객별 | 패키지별
- 고객별: 수평 바 차트(YTD 기준 정렬) + 월별 스택 바 + 상세 테이블
- 패키지별: 도넛 차트 + 월별 추이 + 테이블

### 3. Cost (`/cost`)
- 탭: 고객별 | 패키지별 | 운영비
- 운영비: 프로젝트/프로덕트/소프트웨어 구독 분류

### 4. Resources (`/resources`)
- 정규직 vs 프리랜서 시간 스택 바
- 인원수 추이, CM/Hour 추이

### 5. Client Detail (`/clients/[slug]`)
- 단일 클라이언트: 매출 vs 비용, 마진 계산

## CSV → 타입 매핑

| CSV Rows | Section | Page |
|----------|---------|------|
| 2-11 | Summary | Home |
| 14-26 | Revenue by Client | Revenue 고객별 |
| 29-33 | Revenue by Package | Revenue 패키지별 |
| 36-40 | Sales Accounts | Revenue |
| 42-47 | Resources | Resources |
| 50-66 | Cost by Client | Cost 고객별 |
| 68-73 | Cost by Package | Cost 패키지별 |
| 75-78 | Operation Costs | Cost 운영비 |

## Key Design Decisions

1. **KRW 포맷**: 카드/차트는 축약형(12.7억), 테이블은 전체(1,271,379,006)
2. **실적 vs 전망 구분**: 1-3월 solid, 4-12월 dashed/lighter, 경계선 표시
3. **클라이언트 색상**: constants.ts에 고정 색상 맵 (일관된 시각화)
4. **인증 없음**: v1은 사내 네트워크/VPN 뒤에서 운영 전제
5. **파싱 전략**: 행 인덱스 기반 + 섹션 헤더 검증 (시트 구조 변경 대응)

## Implementation Order

### Phase 1: 프로젝트 부트스트랩
1. Next.js + TypeScript + Tailwind 초기화
2. shadcn/ui 설정, Pretendard 폰트
3. pnpm 의존성 설치 (googleapis, recharts, lru-cache)
4. .env.example 생성

### Phase 2: 데이터 레이어
5. `types/pnl.ts` - 타입 정의
6. `lib/google-sheets.ts` - Sheets API 연결
7. `lib/parse-pnl.ts` - 데이터 파싱
8. `lib/cache.ts` - 캐시
9. `api/sheets/route.ts` - API 엔드포인트
10. CSV 기반 로컬 테스트 (Sheets 연동 전 검증)

### Phase 3: 공통 UI
11. `lib/format.ts` - KRW, % 포맷터
12. `lib/constants.ts` - 상수
13. 레이아웃: sidebar, header
14. 재사용 컴포넌트: summary-cards, data-table

### Phase 4: 페이지 구현
15. Home 대시보드
16. Revenue 페이지
17. Cost 페이지
18. Resources 페이지
19. Client Detail 페이지

### Phase 5: 마무리
20. 로딩 스켈레톤, 에러 바운더리
21. "마지막 업데이트" 표시 + 수동 새로고침
22. 반응형 (태블릿)

## Verification

1. `pnpm dev`로 로컬 실행
2. Home 페이지에서 KPI 카드 값이 CSV Summary와 일치하는지 확인
3. Revenue 페이지에서 고객별 합계 = Total Revenue인지 검증
4. 차트에서 실적/전망 시각적 구분 확인
5. Google Sheets 데이터 변경 후 5분 내 반영 확인
6. `/api/sheets` 엔드포인트 JSON 응답 확인

## Reference Files
- `context/[BubbleShare][Confidential] Business metrics - Finance_Recognized PNL.csv` - 데이터 구조 참조
