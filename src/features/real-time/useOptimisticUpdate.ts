import { useCallback, useEffect, useRef, useState } from "react";

export interface UseOptimisticUpdateResult<T> {
  value: T;
  update: (next: T) => Promise<void>;
  rollback: () => void;
  isPending: boolean;
  error: unknown;
}

export function useOptimisticUpdate<T>(
  serverValue: T,
  updateFn: (next: T) => Promise<T>,
): UseOptimisticUpdateResult<T> {
  const [value, setValue] = useState<T>(serverValue);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const lastKnownRef = useRef<T>(serverValue);

  useEffect(() => {
    if (!isPending) {
      lastKnownRef.current = serverValue;
      setValue(serverValue);
    }
  }, [serverValue, isPending]);

  const update = useCallback(
    async (next: T) => {
      const previous = lastKnownRef.current;
      lastKnownRef.current = next;
      setValue(next);
      setPending(true);
      setError(null);
      try {
        const confirmed = await updateFn(next);
        lastKnownRef.current = confirmed;
        setValue(confirmed);
      } catch (err) {
        lastKnownRef.current = previous;
        setValue(previous);
        setError(err);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [updateFn],
  );

  const rollback = useCallback(() => {
    setValue(lastKnownRef.current);
    setError(null);
  }, []);

  return { value, update, rollback, isPending, error };
}
