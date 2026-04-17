import { useContext, useEffect, useId, useRef } from "react";
import { KeyboardShortcutContext, type ShortcutMetadata } from "./KeyboardShortcutContext";

export function useKeyboardShortcut(
  combo: string | null | false | undefined,
  handler: (e: KeyboardEvent) => void,
  metadata: ShortcutMetadata,
) {
  const ctx = useContext(KeyboardShortcutContext);
  const id = useId();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!ctx || !combo) return;
    return ctx.register({
      id,
      combo,
      description: metadata.description,
      category: metadata.category,
      handler: (e) => handlerRef.current(e),
    });
  }, [ctx, id, combo, metadata.description, metadata.category]);
}

export function useKeyboardShortcuts() {
  const ctx = useContext(KeyboardShortcutContext);
  return ctx;
}
