# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Config Files

These files are **required** for the app to render correctly. If any is missing, Tailwind classes won't compile and the UI breaks silently (no build error, but all styles disappear):

- `postcss.config.mjs` — Loads `@tailwindcss/postcss` plugin. Without it, CSS `@import` for npm packages (tw-animate-css, shadcn/tailwind.css) fails to resolve under Turbopack.
- `src/app/globals.css` — Must have these three imports in order at the top:
  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @import "shadcn/tailwind.css";
  ```
  Removing or reordering these breaks all shadcn component styles. Do NOT inline the CSS content as a workaround — it won't work with Turbopack's module resolution.

When scaffolding or resetting the project, always verify both files exist before running `bun run dev`.

## Commands

```bash
# bun is the package manager (NOT pnpm/npm)
export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH"

bun run dev          # Dev server (Turbopack)
bun run build        # Production build
bun run lint         # ESLint (next/core-web-vitals)
bun test src/__tests__/  # All tests
bun test src/__tests__/format.test.ts  # Single test file
```

## Architecture

**Data pipeline** (all server-side):
```
getPNLData() → cache hit? return : fetchPNLRawData() → parsePNLFromRows() → cache set → return
```

- `src/lib/data.ts` — Single entry point. All pages call `getPNLData()`.
- `src/lib/google-sheets.ts` — Tries Google Sheets API (JWT), falls back to local CSV (`src/data/pnl.csv`).
- `src/lib/parse-pnl.ts` — Row-index-based CSV parser. Row indices are **1-based** and hardcoded (rows 2-78). If the spreadsheet structure changes, this file must be updated manually.
- `src/lib/cache.ts` — LRU cache, 5min TTL (configurable via `CACHE_TTL_MS` env var).
- `src/types/pnl.ts` — `MonthlyValues` is the core type: `{ ytd, ytdProjection, m1...m12 }`. `PNLData` is the top-level container.

**Page pattern** — Every page is a server component that calls `getPNLData()` and passes typed data as props to client chart components:
```
page.tsx (server, async) → getPNLData() → transform data → render <ChartComponent data={...} />
```

**Client components** ("use client") — Only for interactive elements: charts (recharts), sidebar (usePathname), mobile nav (useState). Chart components live in `src/components/dashboard/`.

**Chart conventions**:
- All charts use `ChartWrapper` (Card + ResponsiveContainer)
- Margins/colors/grid from `src/lib/chart-config.ts` (CHART_MARGIN, SEMANTIC_COLORS, CHART_GRID_DASH)
- Actual data = months 1-3 (solid lines), Forecast = months 4-12 (dashed lines). Controlled by `ACTUAL_MONTHS` constant.

**Formatting** — `src/lib/format.ts`:
- `formatKRW(n)` — Abbreviated Korean: 12.7억, 4,286만
- `formatKRWFull(n)` — Full comma format: 1,271,379,006
- Card titles use abbreviated, table cells use full format.

## Key Data

Revenue has 12 clients, Cost has 14 clients (Gitlab and VIVI are cost-only, no revenue). `CLIENT_COLORS` in constants.ts must include all clients from both lists. Use `FALLBACK_COLOR` for any missing.

## Environment Variables

```
GOOGLE_SHEETS_ID          # Spreadsheet ID
GOOGLE_SERVICE_ACCOUNT_EMAIL  # Service account email
GOOGLE_PRIVATE_KEY        # Private key (\\n replaced at runtime)
CACHE_TTL_MS              # Optional, default 300000 (5min)
```

Without Google credentials, the app reads from `src/data/pnl.csv` automatically.

## Korean UI

All user-facing text is Korean. Use 한국어 for labels, descriptions, error messages. English abbreviations (YTD, CM/Hour) are acceptable in table headers but should have Korean explanation in card titles.
