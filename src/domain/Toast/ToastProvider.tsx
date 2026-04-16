import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast } from "./Toast";
import { ToastContext, type ToastOptions } from "./toast-context";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

interface ToastEntry extends ToastOptions {
  id: string;
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxVisible?: number;
  defaultDuration?: number;
}

let uid = 0;
const generateId = () => `toast-${Date.now()}-${uid++}`;

export function ToastProvider({
  children,
  position = "bottom-right",
  maxVisible = 5,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) return;
      const handle = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, handle);
    },
    [dismiss],
  );

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? generateId();
      const duration = options.duration ?? defaultDuration;
      setToasts((prev) => [...prev, { ...options, id }]);
      scheduleDismiss(id, duration);
      return id;
    },
    [defaultDuration, scheduleDismiss],
  );

  const dismissAll = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
      currentTimers.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll]);

  const visible = toasts.slice(-maxVisible);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={`ui-toast-viewport ui-toast-viewport--${position}`}
        role="region"
        aria-label="Notifications"
      >
        {visible.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            title={t.title}
            description={t.description}
            action={t.action}
            dismissible={t.dismissible}
            onDismiss={() => dismiss(t.id)}
            onMouseEnter={() => {
              const handle = timers.current.get(t.id);
              if (handle) {
                clearTimeout(handle);
                timers.current.delete(t.id);
              }
            }}
            onMouseLeave={() => {
              scheduleDismiss(t.id, t.duration ?? defaultDuration);
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
