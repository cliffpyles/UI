import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { Modal } from "../../components/Modal";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { useKeyboardShortcuts } from "./useKeyboardShortcut";
import { formatComboLabel, isMac } from "./normalizeCombo";
import "./KeyboardShortcutCheatSheet.css";

export interface KeyboardShortcutCheatSheetProps {
  /** If provided, controls open state externally. If omitted, "?" key toggles. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Title of the cheat sheet dialog. */
  title?: ReactNode;
  /** Label for the "no shortcuts registered" empty state. */
  emptyLabel?: ReactNode;
}

const EMPTY_SNAPSHOT: never[] = [];

export function KeyboardShortcutCheatSheet({
  open: openProp,
  onOpenChange,
  title = "Keyboard shortcuts",
  emptyLabel = "No keyboard shortcuts registered.",
}: KeyboardShortcutCheatSheetProps) {
  const ctx = useKeyboardShortcuts();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Toggle with "?" key when uncontrolled
  useEffect(() => {
    if (isControlled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "?") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      e.preventDefault();
      setInternalOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isControlled]);

  const shortcuts = useSyncExternalStore(
    useCallback((listener) => (ctx ? ctx.subscribe(listener) : () => {}), [ctx]),
    useCallback(() => (ctx ? ctx.getAll() : EMPTY_SNAPSHOT), [ctx]),
    useCallback(() => EMPTY_SNAPSHOT, []),
  );

  const mac = isMac();
  const byCategory = new Map<string, typeof shortcuts>();
  for (const s of shortcuts) {
    const cat = s.category ?? "General";
    const list = byCategory.get(cat) ?? [];
    list.push(s);
    byCategory.set(cat, list);
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      size="md"
      className="ui-keyboard-cheat-sheet"
    >
      {shortcuts.length === 0 ? (
        <Text as="p" size="base" color="secondary" className="ui-keyboard-cheat-sheet__empty">
          {emptyLabel}
        </Text>
      ) : (
        <Box
          display="flex"
          direction="column"
          gap="section"
          className="ui-keyboard-cheat-sheet__groups"
        >
          {Array.from(byCategory.entries()).map(([category, list]) => (
            <Box
              as="section"
              key={category}
              display="flex"
              direction="column"
              gap="content"
              className="ui-keyboard-cheat-sheet__group"
            >
              <Text as="h3" size="sm" weight="semibold" color="secondary" className="ui-keyboard-cheat-sheet__category">
                {category}
              </Text>
              <ul className="ui-keyboard-cheat-sheet__list">
                {list.map((s) => (
                  <li key={s.id} className="ui-keyboard-cheat-sheet__row">
                    <Text as="span" size="body" color="primary" className="ui-keyboard-cheat-sheet__description">
                      {s.description}
                    </Text>
                    <kbd className="ui-keyboard-cheat-sheet__combo">{formatComboLabel(s.combo, mac)}</kbd>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      )}
    </Modal>
  );
}
