import { useEffect, useRef, useState } from "react";

export interface UseValueChangeOptions {
  /** Detect direction for numeric values. */
  direction?: boolean;
  /** Duration of highlight in ms. Defaults to 1000. */
  duration?: number;
  /** Rate-limit: if changes happen faster than this (ms) apart, skip highlight. Defaults to 1000. */
  rateLimitMs?: number;
  /** Called when the value changes. */
  onChange?: (next: unknown, prev: unknown) => void;
}

export type ChangeDirection = "up" | "down" | "none";

export interface UseValueChangeResult {
  isHighlighted: boolean;
  direction: ChangeDirection;
  /** Whether reduced motion is active. */
  reducedMotion: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function computeDirection(next: unknown, prev: unknown): ChangeDirection {
  if (typeof next === "number" && typeof prev === "number") {
    if (next > prev) return "up";
    if (next < prev) return "down";
  }
  return "none";
}

interface InternalState {
  highlighted: boolean;
  direction: ChangeDirection;
}

export function useValueChange<T>(
  value: T,
  options: UseValueChangeOptions = {},
): UseValueChangeResult {
  const { direction: trackDirection = false, duration = 1000, rateLimitMs = 1000, onChange } = options;
  const prevRef = useRef<T>(value);
  const lastChangeAtRef = useRef<number>(0);
  const [state, setState] = useState<InternalState>({ highlighted: false, direction: "none" });
  const reducedMotion = prefersReducedMotion();

  /* eslint-disable react-hooks/set-state-in-effect -- synchronizing UI state with external value changes is this hook's purpose */
  useEffect(() => {
    const prev = prevRef.current;
    if (Object.is(prev, value)) return;

    const now = Date.now();
    const delta = now - lastChangeAtRef.current;
    const rateLimited = lastChangeAtRef.current > 0 && delta < rateLimitMs;
    lastChangeAtRef.current = now;

    onChange?.(value, prev);
    const nextDirection = trackDirection ? computeDirection(value, prev) : "none";
    prevRef.current = value;

    if (reducedMotion || rateLimited) {
      setState({ highlighted: false, direction: nextDirection });
      return;
    }

    setState({ highlighted: true, direction: nextDirection });
    const t = window.setTimeout(() => {
      setState((s) => ({ ...s, highlighted: false }));
    }, duration);
    return () => window.clearTimeout(t);
  }, [value, trackDirection, duration, rateLimitMs, reducedMotion, onChange]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { isHighlighted: state.highlighted, direction: state.direction, reducedMotion };
}
