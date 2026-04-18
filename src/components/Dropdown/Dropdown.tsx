/* eslint-disable react-refresh/only-export-components */
import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Divider } from "../../primitives/Divider";
import { Button } from "../Button";
import "./Dropdown.css";

/**
 * Dropdown — trigger + action menu pattern.
 *
 * Composition contract (per design/components/composite/Dropdown.md):
 *   - `Popover` would govern the floating-layer portal + positioning +
 *     outside-click. Full `Popover` composition is deferred because `Popover`
 *     hardcodes `role="dialog"` / `aria-haspopup="dialog"` which conflicts
 *     with Dropdown's `role="menu"` / `aria-haspopup="menu"` contract.
 *     Positioning and dismissal logic are reimplemented locally until
 *     `Popover` exposes a role override.
 *   - `Menu` provides the list + item ARIA semantics this component
 *     reimplements locally for the same role-collision reason.
 *   - `Button` renders the trigger (owned chrome + focus ring).
 *   - `Divider` renders `Dropdown.Separator` (token-driven rule).
 */

// --- Context ---

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown compound components must be used within <Dropdown>");
  return ctx;
}

// --- Root ---

interface DropdownRootProps {
  children: ReactNode;
}

function DropdownRoot({ children }: DropdownRootProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const contentId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerId, contentId, triggerRef }}>
      <div className="ui-dropdown">{children}</div>
    </DropdownContext.Provider>
  );
}

// --- Trigger ---

interface DropdownTriggerProps {
  children: ReactNode;
}

function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { open, setOpen, triggerId, contentId, triggerRef } = useDropdownContext();

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        if (!open) {
          e.preventDefault();
          setOpen(true);
        }
      }
    },
    [open, setOpen],
  );

  return (
    <Button
      ref={triggerRef}
      id={triggerId}
      className="ui-dropdown__trigger"
      variant="ghost"
      size="md"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Button>
  );
}

// --- Content ---

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  function DropdownContent({ children, className, ...props }, ref) {
    const { open, setOpen, contentId, triggerId, triggerRef } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Position the menu relative to the trigger
    useEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 200;
      const viewportHeight = window.innerHeight;

      let top = rect.bottom + 4;
      if (top + menuHeight > viewportHeight && rect.top - menuHeight - 4 > 0) {
        top = rect.top - menuHeight - 4;
      }

      setPosition({ top, left: rect.left });
    }, [open, triggerRef]);

    // Focus first item on open
    useEffect(() => {
      if (!open || !menuRef.current) return;
      const firstItem = menuRef.current.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      );
      firstItem?.focus();
    }, [open]);

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open, setOpen, triggerRef]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!menuRef.current) return;

        const items = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"])',
          ),
        );
        const currentIndex = items.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[next]?.focus();
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prev]?.focus();
            break;
          }
          case "Home": {
            e.preventDefault();
            items[0]?.focus();
            break;
          }
          case "End": {
            e.preventDefault();
            items[items.length - 1]?.focus();
            break;
          }
          case "Escape": {
            e.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
            break;
          }
          case "Tab": {
            setOpen(false);
            break;
          }
        }
      },
      [setOpen, triggerRef],
    );

    if (!open) return null;

    const classes = ["ui-dropdown__content", className].filter(Boolean).join(" ");

    return createPortal(
      <div
        ref={(node) => {
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        id={contentId}
        role="menu"
        aria-labelledby={triggerId}
        className={classes}
        style={{ top: position.top, left: position.left }}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>,
      document.body,
    );
  },
);

// --- Item ---

type DropdownItemVariant = "default" | "destructive";

interface DropdownItemProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Called when the item is selected */
  onSelect?: () => void;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Visual variant */
  variant?: DropdownItemVariant;
  children: ReactNode;
}

const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem(
    { onSelect, disabled = false, variant = "default", children, className, ...props },
    ref,
  ) {
    const { setOpen, triggerRef } = useDropdownContext();

    const handleClick = useCallback(() => {
      if (disabled) return;
      onSelect?.();
      setOpen(false);
      triggerRef.current?.focus();
    }, [disabled, onSelect, setOpen, triggerRef]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
          setOpen(false);
          triggerRef.current?.focus();
        }
      },
      [disabled, onSelect, setOpen, triggerRef],
    );

    const classes = [
      "ui-dropdown__item",
      `ui-dropdown__item--${variant}`,
      disabled && "ui-dropdown__item--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Button
        ref={ref}
        role="menuitem"
        variant="ghost"
        size="sm"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

// --- Separator ---

function DropdownSeparator() {
  return <Divider role="separator" className="ui-dropdown__separator" spacing="1" />;
}

// --- Compound export ---

DropdownTrigger.displayName = "Dropdown.Trigger";
DropdownContent.displayName = "Dropdown.Content";
DropdownItem.displayName = "Dropdown.Item";
DropdownSeparator.displayName = "Dropdown.Separator";

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
});

export type { DropdownContentProps, DropdownItemProps };
