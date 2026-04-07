import { describe, test, expect } from "bun:test";
import { slugify, deslugify } from "@/lib/slugify";

describe("slugify", () => {
  test("converts spaces to hyphens", () => { expect(slugify("Adobe APAC")).toBe("adobe-apac"); });
  test("handles Korean characters", () => { expect(slugify("test")).toBe("test"); });
  test("removes special chars", () => { expect(slugify("Ralph Lauren")).toBe("ralph-lauren"); });
});

describe("deslugify", () => {
  test("finds matching name", () => {
    const names = ["Adobe APAC", "Adobe KR", "Samsung"];
    expect(deslugify("adobe-apac", names)).toBe("Adobe APAC");
  });
  test("returns undefined for no match", () => {
    expect(deslugify("nonexistent", ["Adobe"])).toBeUndefined();
  });
});
