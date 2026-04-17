import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useStaleness } from "./useStaleness";
import { useConnectionStatus, type ConnectionState, type ConnectionStatusSource } from "./useConnectionStatus";
import { useOptimisticUpdate } from "./useOptimisticUpdate";
import { usePolling } from "./usePolling";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useStaleness", () => {
  it("computes freshness from threshold config", () => {
    const now = Date.now();
    const { result } = renderHook(() =>
      useStaleness(now - 10_000, {
        agingThreshold: 5_000,
        staleThreshold: 60_000,
        criticalThreshold: 300_000,
        now: () => now,
      }),
    );
    expect(result.current.isAging).toBe(true);
    expect(result.current.age).toBeGreaterThanOrEqual(10_000);
  });

  it("marks stale and critical based on thresholds", () => {
    const now = Date.now();
    const { result: stale } = renderHook(() =>
      useStaleness(now - 120_000, { staleThreshold: 60_000, criticalThreshold: 300_000, now: () => now }),
    );
    expect(stale.current.isStale).toBe(true);
    const { result: critical } = renderHook(() =>
      useStaleness(now - 600_000, { staleThreshold: 60_000, criticalThreshold: 300_000, now: () => now }),
    );
    expect(critical.current.isCritical).toBe(true);
  });

  it("treats null as infinitely stale", () => {
    const { result } = renderHook(() => useStaleness(null));
    expect(result.current.isCritical).toBe(true);
    expect(result.current.age).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("useConnectionStatus", () => {
  function makeSource(initial: ConnectionState): ConnectionStatusSource & { emit: (s: ConnectionState) => void; reconnectCalled: number } {
    let status = initial;
    const listeners = new Set<(s: ConnectionState) => void>();
    let reconnectCalled = 0;
    return {
      subscribe(l) {
        listeners.add(l);
        return () => listeners.delete(l);
      },
      getStatus() {
        return status;
      },
      reconnect() {
        reconnectCalled++;
      },
      emit(next) {
        status = next;
        listeners.forEach((l) => l(next));
      },
      get reconnectCalled() {
        return reconnectCalled;
      },
    };
  }

  it("transitions through states", () => {
    const source = makeSource("connected");
    const { result } = renderHook(() => useConnectionStatus(source));
    expect(result.current.status).toBe("connected");
    act(() => source.emit("disconnected"));
    expect(result.current.status).toBe("disconnected");
    act(() => source.emit("reconnecting"));
    expect(result.current.status).toBe("reconnecting");
    act(() => source.emit("recovered"));
    expect(result.current.status).toBe("recovered");
  });

  it("reconnect calls source.reconnect", () => {
    const source = makeSource("disconnected");
    const { result } = renderHook(() => useConnectionStatus(source));
    act(() => result.current.reconnect());
    expect(source.reconnectCalled).toBe(1);
  });

  it("unsubscribes on unmount", () => {
    const source = makeSource("connected");
    const { result, unmount } = renderHook(() => useConnectionStatus(source));
    unmount();
    act(() => source.emit("disconnected"));
    expect(result.current.status).toBe("connected");
  });
});

describe("useOptimisticUpdate", () => {
  it("reflects optimistic value then confirmed", async () => {
    const updateFn = vi.fn(async (v: number) => v);
    const { result } = renderHook(() => useOptimisticUpdate<number>(1, updateFn));
    await act(async () => {
      await result.current.update(5);
    });
    expect(result.current.value).toBe(5);
    expect(result.current.isPending).toBe(false);
  });

  it("rolls back on failure", async () => {
    const updateFn = vi.fn(async () => {
      throw new Error("nope");
    });
    const { result } = renderHook(() => useOptimisticUpdate<number>(1, updateFn));
    await act(async () => {
      try {
        await result.current.update(5);
      } catch {
        // expected
      }
    });
    expect(result.current.value).toBe(1);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("usePolling", () => {
  it("polls at interval and calls fetch", async () => {
    const fetchFn = vi.fn(async () => 42);
    const { result } = renderHook(() => usePolling(fetchFn, { interval: 50, pauseWhenHidden: false }));
    await waitFor(() => expect(result.current.data).toBe(42));
    await waitFor(() => expect(fetchFn.mock.calls.length).toBeGreaterThanOrEqual(2));
  });

  it("stops when disabled", async () => {
    const fetchFn = vi.fn(async () => 1);
    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => usePolling(fetchFn, { interval: 50, enabled, pauseWhenHidden: false }),
      { initialProps: { enabled: true } },
    );
    await waitFor(() => expect(fetchFn.mock.calls.length).toBeGreaterThanOrEqual(1));
    rerender({ enabled: false });
    const callsWhenDisabled = fetchFn.mock.calls.length;
    await new Promise((r) => setTimeout(r, 200));
    expect(fetchFn.mock.calls.length).toBe(callsWhenDisabled);
  });

  it("calls onError on failure", async () => {
    const onError = vi.fn();
    const fetchFn = vi.fn(async () => {
      throw new Error("boom");
    });
    renderHook(() => usePolling(fetchFn, { interval: 50, onError, pauseWhenHidden: false }));
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it("cleans up interval on unmount", async () => {
    const fetchFn = vi.fn(async () => 1);
    const { unmount } = renderHook(() => usePolling(fetchFn, { interval: 50, pauseWhenHidden: false }));
    await waitFor(() => expect(fetchFn).toHaveBeenCalled());
    unmount();
    const callsBefore = fetchFn.mock.calls.length;
    await new Promise((r) => setTimeout(r, 200));
    expect(fetchFn.mock.calls.length).toBe(callsBefore);
  });
});
