import { describe, it, expect } from "vitest";
import { formatNumber } from "./number";

describe("formatNumber", () => {
  it("formats integers with thousands separators", () => {
    expect(formatNumber(1234567, { locale: "en-US" })).toBe("1,234,567");
  });

  it("formats decimals", () => {
    expect(formatNumber(1234.56, { locale: "en-US", decimals: 2 })).toBe(
      "1,234.56",
    );
  });

  it("formats zero", () => {
    expect(formatNumber(0, { locale: "en-US" })).toBe("0");
  });

  it("formats negative numbers", () => {
    expect(formatNumber(-1234, { locale: "en-US" })).toBe("-1,234");
  });

  it("formats very large numbers", () => {
    expect(formatNumber(1e12, { locale: "en-US" })).toBe(
      "1,000,000,000,000",
    );
  });

  it("returns em dash for null", () => {
    expect(formatNumber(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatNumber(undefined)).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatNumber(NaN)).toBe("\u2014");
  });

  it("respects decimals option", () => {
    expect(formatNumber(1234, { locale: "en-US", decimals: 2 })).toBe(
      "1,234.00",
    );
  });

  it("respects minDecimals option", () => {
    expect(
      formatNumber(1234.5, { locale: "en-US", minDecimals: 2 }),
    ).toBe("1,234.50");
  });

  it("formats with de-DE locale", () => {
    expect(formatNumber(1234567.89, { locale: "de-DE", decimals: 2 })).toBe(
      "1.234.567,89",
    );
  });

  it("formats with ja-JP locale", () => {
    expect(formatNumber(1234567, { locale: "ja-JP" })).toBe("1,234,567");
  });
});
