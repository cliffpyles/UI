import { useEffect, useState } from "react";

export type Freshness = "fresh" | "aging" | "stale" | "critical";

export interface UseStalenessOptions {
  /** Time after which data is considered aging. Defaults to 60s. */
  agingThreshold?: number;
  /** Time after which data is considered stale. Defaults to 5 min. */
  staleThreshold?: number;
  /** Time after which data is considered critical. Defaults to 30 min. */
  criticalThreshold?: number;
  /** Recompute interval in ms. Defaults to 10s. */
  checkInterval?: number;
  /** Current time getter (overridable for tests). */
  now?: () => number;
}

export interface UseStalenessResult {
  age: number;
  freshness: Freshness;
  isFresh: boolean;
  isAging: boolean;
  isStale: boolean;
  isCritical: boolean;
}

function toMillis(date: Date | number | string | null | undefined): number | null {
  if (date == null) return null;
  if (date instanceof Date) return date.getTime();
  if (typeof date === "number") return date;
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? null : parsed;
}

export function useStaleness(
  lastUpdated: Date | number | string | null | undefined,
  options: UseStalenessOptions = {},
): UseStalenessResult {
  const {
    agingThreshold = 60_000,
    staleThreshold = 5 * 60_000,
    criticalThreshold = 30 * 60_000,
    checkInterval = 10_000,
    now = () => Date.now(),
  } = options;

  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), checkInterval);
    return () => window.clearInterval(id);
  }, [checkInterval]);

  const lastMs = toMillis(lastUpdated);
  const age = lastMs == null ? Number.POSITIVE_INFINITY : Math.max(0, now() - lastMs);

  let freshness: Freshness = "fresh";
  if (age >= criticalThreshold) freshness = "critical";
  else if (age >= staleThreshold) freshness = "stale";
  else if (age >= agingThreshold) freshness = "aging";

  return {
    age,
    freshness,
    isFresh: freshness === "fresh",
    isAging: freshness === "aging",
    isStale: freshness === "stale",
    isCritical: freshness === "critical",
  };
}
