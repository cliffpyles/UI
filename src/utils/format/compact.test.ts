import { describe, it, expect } from "vitest";
import { formatCompact } from "./compact";

describe("formatCompact", () => {
  it("formats thousands", () => {
    expect(formatCompact(1234, { locale: "en-US" })).toBe("1.2K");
  });

  it("formats millions", () => {
    expect(formatCompact(3400000, { locale: "en-US" })).toBe("3.4M");
  });

  it("formats billions", () => {
    expect(formatCompact(1200000000, { locale: "en-US" })).toBe("1.2B");
  });

  it("formats small numbers without compact notation", () => {
    expect(formatCompact(123, { locale: "en-US" })).toBe("123");
  });

  it("formats zero", () => {
    expect(formatCompact(0, { locale: "en-US" })).toBe("0");
  });

  it("formats negative numbers", () => {
    expect(formatCompact(-1234, { locale: "en-US" })).toBe("-1.2K");
  });

  it("respects decimals option", () => {
    expect(formatCompact(1234, { locale: "en-US", decimals: 2 })).toBe(
      "1.23K",
    );
  });

  it("returns em dash for null", () => {
    expect(formatCompact(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatCompact(undefined)).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatCompact(NaN)).toBe("\u2014");
  });

  it("formats very large numbers", () => {
    const result = formatCompact(1e12, { locale: "en-US" });
    expect(result).toBe("1T");
  });

  it("formats with de-DE locale", () => {
    const result = formatCompact(1234, { locale: "de-DE" });
    // German uses different compact notation
    expect(result).toBeTruthy();
    expect(result).not.toBe("\u2014");
  });
});
