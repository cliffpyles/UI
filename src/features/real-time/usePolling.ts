import { useCallback, useEffect, useRef, useState } from "react";

export interface UsePollingOptions<T> {
  /** Polling interval in ms. */
  interval: number;
  /** Enable or disable polling. Defaults to true. */
  enabled?: boolean;
  /** Called on fetch error. */
  onError?: (err: unknown) => void;
  /** Initial data value. */
  initialData?: T;
  /** Only poll while the document is visible. Defaults to true. */
  pauseWhenHidden?: boolean;
}

export interface UsePollingResult<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown;
  refresh: () => Promise<void>;
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions<T>,
): UsePollingResult<T> {
  const { interval, enabled = true, onError, initialData, pauseWhenHidden = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const fetchRef = useRef(fetchFn);
  const onErrorRef = useRef(onError);
  const mountedRef = useRef(true);

  useEffect(() => {
    fetchRef.current = fetchFn;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchRef.current();
      if (!mountedRef.current) return;
      setData(next);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err);
      onErrorRef.current?.(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      if (pauseWhenHidden && typeof document !== "undefined" && document.hidden) return;
      await run();
    };

    tick();
    const id = window.setInterval(tick, interval);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [enabled, interval, run, pauseWhenHidden]);

  return { data, loading, error, refresh: run };
}
