import { useCallback, useSyncExternalStore } from "react";

export type ConnectionState = "connected" | "reconnecting" | "disconnected" | "recovered";

export interface ConnectionStatusSource {
  /** Subscribe to status changes. Should return an unsubscribe function. */
  subscribe: (listener: (state: ConnectionState) => void) => () => void;
  /** Current status. */
  getStatus: () => ConnectionState;
  /** Optional manual reconnect handler. */
  reconnect?: () => void;
}

export interface UseConnectionStatusResult {
  status: ConnectionState;
  reconnect: () => void;
}

export function useConnectionStatus(source: ConnectionStatusSource): UseConnectionStatusResult {
  const status = useSyncExternalStore(
    useCallback(
      (listener) => source.subscribe(() => listener()),
      [source],
    ),
    useCallback(() => source.getStatus(), [source]),
    useCallback(() => source.getStatus(), [source]),
  );

  const reconnect = useCallback(() => {
    source.reconnect?.();
  }, [source]);

  return { status, reconnect };
}
