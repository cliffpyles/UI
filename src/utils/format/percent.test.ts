import { describe, it, expect } from "vitest";
import { formatPercent } from "./percent";

describe("formatPercent", () => {
  it("formats a percentage with default precision", () => {
    expect(formatPercent(12.3, { locale: "en-US" })).toBe("12.3%");
  });

  it("formats zero", () => {
    expect(formatPercent(0, { locale: "en-US" })).toBe("0.0%");
  });

  it("formats 100%", () => {
    expect(formatPercent(100, { locale: "en-US" })).toBe("100.0%");
  });

  it("formats negative percentages", () => {
    expect(formatPercent(-5.5, { locale: "en-US" })).toBe("-5.5%");
  });

  it("respects decimals option", () => {
    expect(formatPercent(12.345, { locale: "en-US", decimals: 2 })).toBe(
      "12.35%",
    );
  });

  it("shows sign when requested", () => {
    expect(formatPercent(12.3, { locale: "en-US", sign: true })).toBe(
      "+12.3%",
    );
  });

  it("shows negative sign with sign option", () => {
    expect(formatPercent(-5.5, { locale: "en-US", sign: true })).toBe(
      "-5.5%",
    );
  });

  it("shows no sign for zero with sign option", () => {
    expect(formatPercent(0, { locale: "en-US", sign: true })).toBe("0.0%");
  });

  it("formats with de-DE locale", () => {
    const result = formatPercent(12.3, { locale: "de-DE" });
    // German uses comma as decimal separator
    expect(result).toContain("12,3");
    expect(result).toContain("%");
  });

  it("returns em dash for null", () => {
    expect(formatPercent(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatPercent(undefined)).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatPercent(NaN)).toBe("\u2014");
  });

  it("formats very large percentages", () => {
    const result = formatPercent(9999.9, { locale: "en-US" });
    expect(result).toBe("9,999.9%");
  });
});
