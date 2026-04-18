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
  type MouseEvent as ReactMouseEvent,
} from "react";
import "./Popover.css";

// --- Types ---

export type PopoverPlacement =
  | "bottom-start"
  | "bottom"
  | "bottom-end"
  | "top-start"
  | "top"
  | "top-end";

// --- Context ---

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  placement: PopoverPlacement;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover compound components must be used within <Popover>");
  return ctx;
}

// --- Root ---

interface PopoverOwnProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement of the content relative to the trigger */
  placement?: PopoverPlacement;
  children: ReactNode;
}

export type PopoverProps = PopoverOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

const PopoverRoot = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      placement = "bottom-start",
      children,
      className,
      ...props
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const triggerId = useId();
    const contentId = useId();
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const classes = ["ui-popover", className].filter(Boolean).join(" ");

    return (
      <PopoverContext.Provider
        value={{ open, setOpen, triggerId, contentId, triggerRef, placement }}
      >
        <div ref={ref} className={classes} {...props}>
          {children}
        </div>
      </PopoverContext.Provider>
    );
  },
);

// --- Trigger ---

interface PopoverTriggerProps {
  /** Render the single child as the trigger instead of wrapping in a button. */
  asChild?: boolean;
  children: ReactNode;
}

type TriggerChildProps = {
  id?: string;
  "aria-haspopup"?: "dialog";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  onClick?: (e: ReactMouseEvent) => void;
};

function PopoverTrigger({ asChild = false, children }: PopoverTriggerProps) {
  const { open, setOpen, triggerId, contentId, triggerRef } = usePopoverContext();

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      // Honor a child-provided handler when asChild
      if (asChild && isValidElement(children)) {
        const childProps = (children as ReactElement<TriggerChildProps>).props;
        childProps.onClick?.(e);
        if (e.defaultPrevented) return;
      }
      setOpen(!open);
    },
    [asChild, children, open, setOpen],
  );

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
    },
    [triggerRef],
  );

  const ariaProps: TriggerChildProps = {
    id: triggerId,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,
  };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<TriggerChildProps>;
    const cloneProps: Record<string, unknown> = {
      ...ariaProps,
      onClick: handleClick,
    };
    cloneProps.ref = setTriggerRef;
    return cloneElement(child, cloneProps as Partial<TriggerChildProps>);
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      className="ui-popover__trigger"
      {...ariaProps}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

// --- Content ---

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ children, className, ...props }, ref) {
    const { open, setOpen, triggerId, contentId, triggerRef, placement } =
      usePopoverContext();
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Close on Escape / outside click
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      };
      const onMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (contentRef.current?.contains(target)) return;
        if (triggerRef.current?.contains(target)) return;
        setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onMouseDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("mousedown", onMouseDown);
      };
    }, [open, setOpen, triggerRef]);

    // Focus first focusable child on open
    useEffect(() => {
      if (!open || !contentRef.current) return;
      const focusable = contentRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) focusable.focus();
      else contentRef.current.focus();
    }, [open]);

    if (!open) return null;

    const classes = [
      "ui-popover__content",
      `ui-popover__content--placement-${placement}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        id={contentId}
        role="dialog"
        aria-labelledby={triggerId}
        tabIndex={-1}
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// --- Compound export ---

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
