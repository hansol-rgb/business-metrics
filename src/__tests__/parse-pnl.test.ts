import { describe, test, expect } from "bun:test";
import { parsePNLFromRows } from "@/lib/parse-pnl";

describe("parsePNLFromRows", () => {
  test("throws on insufficient rows", () => {
    const rows = Array.from({ length: 10 }, () => ["", "", ""]);
    expect(() => parsePNLFromRows(rows)).toThrow("Invalid CSV: expected at least 78 rows, got 10");
  });

  test("parses minimal dataset without throwing", () => {
    // Create 80 rows with enough cells (17 columns each)
    const rows = Array.from({ length: 80 }, () =>
      Array.from({ length: 17 }, () => "0")
    );
    const result = parsePNLFromRows(rows);
    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.summary.totalRevenue.ytd).toBe(0);
    expect(result.revenueByClient).toHaveLength(12);
    expect(result.costByClient).toHaveLength(14);
  });
});
