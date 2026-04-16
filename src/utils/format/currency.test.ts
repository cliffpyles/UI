import { describe, it, expect } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("formats USD", () => {
    expect(formatCurrency(1234.56, "USD", { locale: "en-US" })).toBe(
      "$1,234.56",
    );
  });

  it("formats EUR in en-US locale", () => {
    const result = formatCurrency(1234.56, "EUR", { locale: "en-US" });
    expect(result).toContain("1,234.56");
  });

  it("formats EUR in de-DE locale", () => {
    const result = formatCurrency(1234.56, "EUR", { locale: "de-DE" });
    // German format: 1.234,56 €
    expect(result).toContain("1.234,56");
  });

  it("formats JPY (zero decimals by default)", () => {
    const result = formatCurrency(1234, "JPY", { locale: "ja-JP" });
    expect(result).toContain("1,234");
  });

  it("formats zero", () => {
    expect(formatCurrency(0, "USD", { locale: "en-US" })).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    const result = formatCurrency(-1234.56, "USD", { locale: "en-US" });
    expect(result).toContain("1,234.56");
  });

  it("respects decimals option", () => {
    expect(
      formatCurrency(1234, "USD", { locale: "en-US", decimals: 0 }),
    ).toBe("$1,234");
  });

  it("returns em dash for null", () => {
    expect(formatCurrency(null, "USD")).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatCurrency(undefined, "USD")).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatCurrency(NaN, "USD")).toBe("\u2014");
  });

  it("formats very large amounts", () => {
    const result = formatCurrency(1e12, "USD", { locale: "en-US" });
    expect(result).toBe("$1,000,000,000,000.00");
  });
});
