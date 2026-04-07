import { describe, test, expect } from "bun:test";
import { formatKRW, formatKRWFull, formatPercent, formatNumber } from "@/lib/format";

describe("formatKRW", () => {
  test("formats billions", () => { expect(formatKRW(1_271_379_006)).toBe("12.7억"); });
  test("formats millions", () => { expect(formatKRW(42_860_000)).toBe("4,286만"); });
  test("formats small numbers", () => { expect(formatKRW(1234)).toBe("1,234"); });
  test("formats zero", () => { expect(formatKRW(0)).toBe("0"); });
  test("formats negative billions", () => { expect(formatKRW(-500_000_000)).toBe("-5억"); });
  test("formats negative millions", () => { expect(formatKRW(-42_860_000)).toBe("-4,286만"); });
});

describe("formatKRWFull", () => {
  test("formats with commas", () => { expect(formatKRWFull(1271379006)).toBe("1,271,379,006"); });
});

describe("formatPercent", () => {
  test("formats percentage", () => { expect(formatPercent(84.76)).toBe("84.76%"); });
  test("formats zero", () => { expect(formatPercent(0)).toBe("0.00%"); });
});
