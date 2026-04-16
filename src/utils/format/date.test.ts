import { describe, it, expect } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  const now = new Date("2025-06-15T12:00:00Z");

  it("shows 'Just now' for less than a minute ago", () => {
    const date = new Date("2025-06-15T11:59:30Z");
    expect(formatDate(date, { now })).toBe("Just now");
  });

  it("shows minutes ago", () => {
    const date = new Date("2025-06-15T11:55:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("5 minutes ago");
  });

  it("shows hours ago", () => {
    const date = new Date("2025-06-15T09:00:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("3 hours ago");
  });

  it("shows days ago", () => {
    const date = new Date("2025-06-12T12:00:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("3 days ago");
  });

  it("shows short date for same year beyond 7 days", () => {
    const date = new Date("2025-03-15T12:00:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("Mar 15");
  });

  it("shows date with year for different year", () => {
    const date = new Date("2024-03-15T12:00:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("Mar 15, 2024");
  });

  it("formats full date+time", () => {
    const date = new Date("2025-06-15T14:30:00Z");
    const result = formatDate(date, { format: "full", locale: "en-US" });
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats short date", () => {
    const date = new Date("2025-03-15T12:00:00Z");
    const result = formatDate(date, { format: "short", now, locale: "en-US" });
    expect(result).toBe("Mar 15");
  });

  it("shows absolute date for future dates", () => {
    const date = new Date("2025-07-01T12:00:00Z");
    const result = formatDate(date, { now, locale: "en-US" });
    expect(result).toBe("Jul 1");
  });

  it("accepts string dates", () => {
    expect(formatDate("2025-03-15T12:00:00Z", { now, locale: "en-US" })).toBe(
      "Mar 15",
    );
  });

  it("accepts timestamps", () => {
    const ts = new Date("2025-03-15T12:00:00Z").getTime();
    expect(formatDate(ts, { now, locale: "en-US" })).toBe("Mar 15");
  });

  it("returns em dash for null", () => {
    expect(formatDate(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(formatDate(undefined)).toBe("\u2014");
  });

  it("returns em dash for invalid date string", () => {
    expect(formatDate("not-a-date")).toBe("\u2014");
  });
});
