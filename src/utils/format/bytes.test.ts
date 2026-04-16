import { describe, it, expect } from "vitest";
import { formatBytes } from "./bytes";

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(500, { locale: "en-US" })).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1536, { locale: "en-US" })).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(5_242_880, { locale: "en-US" })).toBe("5.0 MB");
  });

  it("formats gigabytes", () => {
    expect(formatBytes(1_073_741_824, { locale: "en-US" })).toBe("1.0 GB");
  });

  it("formats terabytes", () => {
    expect(formatBytes(1_099_511_627_776, { locale: "en-US" })).toBe("1.0 TB");
  });

  it("formats zero", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("respects decimals option", () => {
    expect(formatBytes(1536, { locale: "en-US", decimals: 2 })).toBe(
      "1.50 KB",
    );
  });

  it("formats with de-DE locale", () => {
    const result = formatBytes(1536, { locale: "de-DE" });
    expect(result).toContain("1,5");
    expect(result).toContain("KB");
  });

  it("returns em dash for null", () => {
    expect(formatBytes(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatBytes(undefined)).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatBytes(NaN)).toBe("\u2014");
  });

  it("returns em dash for negative values", () => {
    expect(formatBytes(-100)).toBe("\u2014");
  });

  it("formats very large values", () => {
    // 1 PB
    const result = formatBytes(1_125_899_906_842_624, { locale: "en-US" });
    expect(result).toBe("1.0 PB");
  });
});
