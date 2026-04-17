import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { KeyboardShortcutContext, type RegisteredShortcut } from "./KeyboardShortcutContext";
import { eventToCombo, normalizeCombo } from "./normalizeCombo";

export interface KeyboardShortcutProviderProps {
  children: ReactNode;
  /** When true, warns on conflicting combos. Defaults to NODE_ENV !== "production". */
  warnOnConflict?: boolean;
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function KeyboardShortcutProvider({
  children,
  warnOnConflict = import.meta.env?.DEV ?? false,
}: KeyboardShortcutProviderProps) {
  const shortcutsRef = useRef<Map<string, RegisteredShortcut>>(new Map());
  const listenersRef = useRef<Set<() => void>>(new Set());
  const snapshotRef = useRef<RegisteredShortcut[]>([]);

  const notify = useCallback(() => {
    snapshotRef.current = Array.from(shortcutsRef.current.values());
    for (const listener of listenersRef.current) listener();
  }, []);

  const register = useCallback(
    (shortcut: RegisteredShortcut) => {
      const normalized = normalizeCombo(shortcut.combo);
      const entry = { ...shortcut, combo: normalized };
      const existing = Array.from(shortcutsRef.current.values()).find((s) => s.combo === normalized);
      if (warnOnConflict && existing) {
        console.warn(
          `[KeyboardShortcut] Conflict: "${normalized}" is already registered by "${existing.description}". Overriding with "${shortcut.description}".`,
        );
      }
      shortcutsRef.current.set(shortcut.id, entry);
      notify();
      return () => {
        shortcutsRef.current.delete(shortcut.id);
        notify();
      };
    },
    [warnOnConflict, notify],
  );

  const getAll = useCallback(() => snapshotRef.current, []);

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFormField(e.target)) return;
      const combo = eventToCombo(e);
      for (const shortcut of shortcutsRef.current.values()) {
        if (shortcut.combo === combo) {
          shortcut.handler(e);
          break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const value = useMemo(() => ({ register, getAll, subscribe }), [register, getAll, subscribe]);

  return <KeyboardShortcutContext value={value}>{children}</KeyboardShortcutContext>;
}
