import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import "./CommandPalette.css";

export interface CommandItem {
  id: string;
  label: string;
  category?: string;
  description?: string;
  icon?: IconName;
  shortcut?: string;
  keywords?: string[];
  onSelect?: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  recentIds?: string[];
  onSelect?: (item: CommandItem) => void;
}

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  let i = 0;
  for (const c of n) {
    const pos = h.indexOf(c, i);
    if (pos < 0) return false;
    i = pos + 1;
  }
  return true;
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  function CommandPalette(
    {
      open,
      onClose,
      items,
      placeholder = "Type a command or search…",
      emptyMessage = "No results",
      recentIds = [],
      onSelect,
      className,
      ...rest
    },
    ref,
  ) {
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const reactId = useId();
    const listboxId = `cmdp-${reactId}`;

    const filtered = useMemo(() => {
      const q = query.trim();
      if (!q) {
        const recent = recentIds
          .map((id) => items.find((i) => i.id === id))
          .filter((v): v is CommandItem => !!v);
        const rest = items.filter((i) => !recentIds.includes(i.id));
        return { ordered: [...recent, ...rest], showRecent: recent.length > 0 };
      }
      const ordered = items.filter((item) => {
        const hay = [item.label, item.category, item.description, ...(item.keywords ?? [])]
          .filter(Boolean)
          .join(" ");
        return fuzzyMatch(hay, q);
      });
      return { ordered, showRecent: false };
    }, [items, query, recentIds]);

    const grouped = useMemo(() => {
      const groups = new Map<string, CommandItem[]>();
      for (const item of filtered.ordered) {
        const key = item.category ?? "";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(item);
      }
      return Array.from(groups.entries());
    }, [filtered]);

    const flat = filtered.ordered;
    const clampedIdx = Math.min(activeIdx, Math.max(flat.length - 1, 0));

    const [prevOpen, setPrevOpen] = useState(open);
    const [prevQuery, setPrevQuery] = useState(query);
    if (prevOpen !== open) {
      setPrevOpen(open);
      if (open) {
        setQuery("");
        setActiveIdx(0);
      }
    }
    if (prevQuery !== query) {
      setPrevQuery(query);
      setActiveIdx(0);
    }

    useEffect(() => {
      if (open) {
        const raf = requestAnimationFrame(() => inputRef.current?.focus());
        return () => cancelAnimationFrame(raf);
      }
    }, [open]);

    const select = useCallback(
      (item: CommandItem) => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelect?.(item);
        onClose();
      },
      [onClose, onSelect],
    );

    if (!open) return null;

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flat[clampedIdx];
        if (item) select(item);
      }
    };

    const classes = ["ui-command-palette", className].filter(Boolean).join(" ");
    const activeItem = flat[clampedIdx];

    return (
      <div
        className="ui-command-palette__overlay"
        onClick={onClose}
        role="presentation"
      >
        <div
          ref={ref}
          role="dialog"
          aria-label="Command palette"
          aria-modal="true"
          className={classes}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          {...rest}
        >
          <div className="ui-command-palette__input-wrap">
            <Icon name="search" size="sm" className="ui-command-palette__search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="ui-command-palette__input"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeItem ? `${listboxId}-${activeItem.id}` : undefined
              }
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            className="ui-command-palette__list"
            aria-label="Commands"
          >
            {flat.length === 0 && (
              <li className="ui-command-palette__empty" role="presentation">
                {emptyMessage}
              </li>
            )}
            {grouped.map(([category, groupItems], gIdx) => {
              const showHeader =
                (filtered.showRecent && gIdx === 0) || (category && !filtered.showRecent);
              const headerLabel =
                filtered.showRecent && gIdx === 0 ? "Recent" : category;
              return (
                <li key={category || `group-${gIdx}`} role="presentation">
                  {showHeader && (
                    <div
                      className="ui-command-palette__group-header"
                      role="presentation"
                    >
                      {headerLabel}
                    </div>
                  )}
                  <ul role="presentation" className="ui-command-palette__group">
                    {groupItems.map((item) => {
                      const idx = flat.indexOf(item);
                      const active = idx === clampedIdx;
                      return (
                        <li
                          key={item.id}
                          id={`${listboxId}-${item.id}`}
                          role="option"
                          aria-selected={active}
                          aria-disabled={item.disabled}
                          className={[
                            "ui-command-palette__item",
                            active && "ui-command-palette__item--active",
                            item.disabled && "ui-command-palette__item--disabled",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => select(item)}
                        >
                          {item.icon && <Icon name={item.icon} size="sm" />}
                          <span className="ui-command-palette__item-label">
                            {item.label}
                            {item.description && (
                              <span className="ui-command-palette__item-desc">
                                {item.description}
                              </span>
                            )}
                          </span>
                          {item.shortcut && (
                            <kbd className="ui-command-palette__shortcut">
                              {item.shortcut}
                            </kbd>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);
