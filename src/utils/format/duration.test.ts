import { describe, it, expect } from "vitest";
import { formatDuration } from "./duration";

describe("formatDuration", () => {
  describe("human style", () => {
    it("formats seconds", () => {
      expect(formatDuration(30_000)).toBe("30s");
    });

    it("formats minutes", () => {
      expect(formatDuration(300_000)).toBe("5m");
    });

    it("formats hours and minutes", () => {
      expect(formatDuration(8_100_000)).toBe("2h 15m");
    });

    it("formats days and hours", () => {
      expect(formatDuration(273_600_000)).toBe("3d 4h");
    });

    it("formats zero", () => {
      expect(formatDuration(0)).toBe("0s");
    });

    it("formats large durations", () => {
      // 10 days
      expect(formatDuration(864_000_000)).toBe("10d");
    });
  });

  describe("compact style", () => {
    it("formats hours:minutes:seconds", () => {
      expect(formatDuration(8_100_000, { style: "compact" })).toBe("2:15:00");
    });

    it("formats with days", () => {
      expect(formatDuration(273_600_000, { style: "compact" })).toBe(
        "3:04:00:00",
      );
    });

    it("formats zero", () => {
      expect(formatDuration(0, { style: "compact" })).toBe("0:00:00");
    });

    it("formats sub-minute durations", () => {
      expect(formatDuration(30_000, { style: "compact" })).toBe("0:00:30");
    });
  });

  it("returns em dash for null", () => {
    expect(formatDuration(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatDuration(undefined)).toBe("\u2014");
  });

  it("returns em dash for NaN", () => {
    expect(formatDuration(NaN)).toBe("\u2014");
  });

  it("returns em dash for negative values", () => {
    expect(formatDuration(-1000)).toBe("\u2014");
  });
});
