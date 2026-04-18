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
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from "react";
import "./Menu.css";

// --- Context ---

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  listId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Menu compound components must be used within <Menu>");
  return ctx;
}

// --- Root ---

interface MenuRootOwnProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export type MenuProps = MenuRootOwnProps;

function MenuRoot({ open: controlledOpen, defaultOpen, onOpenChange, children }: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const triggerId = useId();
  const listId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerId, listId, triggerRef }}>
      <div className="ui-menu">{children}</div>
    </MenuContext.Provider>
  );
}

// --- Trigger ---

interface MenuTriggerOwnProps {
  /** When true, clones the child and forwards props instead of rendering a button wrapper. */
  asChild?: boolean;
  children: ReactNode;
}

export type MenuTriggerProps = MenuTriggerOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

interface AsChildProps {
  id?: string;
  "aria-haspopup"?: "menu";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  function MenuTrigger({ asChild, children, onClick, onKeyDown, className, ...rest }, ref) {
    const { open, setOpen, triggerId, listId, triggerRef } = useMenuContext();

    const assignButtonRef: Ref<HTMLButtonElement> = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, triggerRef],
    );
    const assignChildRef = useCallback(
      (node: HTMLElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node as HTMLButtonElement | null);
        else if (ref)
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node as HTMLButtonElement | null;
      },
      [ref, triggerRef],
    );

    const handleClick = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        onClick?.(e as MouseEvent<HTMLButtonElement>);
        if (!e.defaultPrevented) setOpen(!open);
      },
      [onClick, open, setOpen],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(e as KeyboardEvent<HTMLButtonElement>);
        if (e.defaultPrevented) return;
        if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && !open) {
          e.preventDefault();
          setOpen(true);
        }
      },
      [onKeyDown, open, setOpen],
    );

    const sharedProps: AsChildProps = {
      id: triggerId,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? listId : undefined,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>;
      const childProps = child.props as Record<string, unknown>;
      const childClassName = typeof childProps.className === "string" ? childProps.className : "";
      const merged = {
        ...sharedProps,
        ref: assignChildRef,
        className: ["ui-menu__trigger", childClassName, className].filter(Boolean).join(" "),
      };
      return cloneElement(child, merged);
    }

    const classes = ["ui-menu__trigger", className].filter(Boolean).join(" ");

    return (
      <button
        ref={(node: HTMLButtonElement | null) => { assignButtonRef(node); }}
        type="button"
        className={classes}
        {...sharedProps}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

// --- List ---

export type MenuListProps = HTMLAttributes<HTMLDivElement>;

const MenuList = forwardRef<HTMLDivElement, MenuListProps>(
  function MenuList({ children, className, ...props }, ref) {
    const { open, setOpen, listId, triggerId, triggerRef } = useMenuContext();
    const listRef = useRef<HTMLDivElement | null>(null);

    const assignRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Focus first enabled item on open.
    useEffect(() => {
      if (!open || !listRef.current) return;
      const first = listRef.current.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      );
      first?.focus();
    }, [open]);

    // Close on outside click.
    useEffect(() => {
      if (!open) return;
      function handler(e: globalThis.MouseEvent) {
        const target = e.target as Node;
        if (
          listRef.current &&
          !listRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open, setOpen, triggerRef]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (!listRef.current) return;
        const items = Array.from(
          listRef.current.querySelectorAll<HTMLElement>(
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

    const classes = ["ui-menu__list", className].filter(Boolean).join(" ");

    return (
      <div
        ref={assignRef}
        id={listId}
        role="menu"
        aria-labelledby={triggerId}
        className={classes}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// --- Item ---

interface MenuItemOwnProps {
  /** Called when the item is activated (click, Enter, or Space). */
  onSelect?: () => void;
  /** Whether the item is disabled. */
  disabled?: boolean;
  children: ReactNode;
}

export type MenuItemProps = MenuItemOwnProps & HTMLAttributes<HTMLDivElement>;

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem(
    { onSelect, disabled = false, children, className, onClick, onKeyDown, ...props },
    ref,
  ) {
    const { setOpen, triggerRef } = useMenuContext();

    const activate = useCallback(() => {
      if (disabled) return;
      onSelect?.();
      setOpen(false);
      triggerRef.current?.focus();
    }, [disabled, onSelect, setOpen, triggerRef]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        activate();
      },
      [activate, onClick],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      },
      [activate, disabled, onKeyDown],
    );

    const classes = [
      "ui-menu__item",
      disabled && "ui-menu__item--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// --- Separator ---

export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  function MenuSeparator({ className, ...props }, ref) {
    const classes = ["ui-menu__separator", className].filter(Boolean).join(" ");
    return <div ref={ref} role="separator" className={classes} {...props} />;
  },
);

// --- Compound export ---

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  List: MenuList,
  Item: MenuItem,
  Separator: MenuSeparator,
});
