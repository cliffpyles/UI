import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./PopoverPeekLayout.css";

export type PopoverTrigger = "hover" | "click";

export interface PopoverPeekLayoutProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  content: ReactNode;
  actions?: ReactNode;
  trigger?: PopoverTrigger;
  delay?: number;
  pinnable?: boolean;
  children: ReactNode;
}

export const PopoverPeekLayout = forwardRef<HTMLSpanElement, PopoverPeekLayoutProps>(
  function PopoverPeekLayout(
    {
      content,
      actions,
      trigger = "hover",
      delay = 200,
      pinnable = false,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const rootRef = useRef<HTMLSpanElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setRefs = (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
          setPinned(false);
        }
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      if (trigger !== "hover" || pinned) return;
      clearTimer();
      timerRef.current = setTimeout(() => setOpen(true), delay);
    };

    const handleMouseLeave = () => {
      if (trigger !== "hover" || pinned) return;
      clearTimer();
      timerRef.current = setTimeout(() => setOpen(false), 100);
    };

    const handleClick = () => {
      if (trigger === "click") {
        setOpen((o) => !o);
      }
    };

    const classes = ["ui-popover-peek", className].filter(Boolean).join(" ");

    return (
      <span
        ref={setRefs}
        className={classes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <span className="ui-popover-peek__trigger" onClick={handleClick}>
          {children}
        </span>
        {open && (
          <span
            role="dialog"
            aria-label="Peek"
            className="ui-popover-peek__popover"
          >
            <span className="ui-popover-peek__content">{content}</span>
            {(actions || pinnable) && (
              <span className="ui-popover-peek__footer">
                {actions}
                {pinnable && (
                  <button
                    type="button"
                    className="ui-popover-peek__pin"
                    aria-pressed={pinned}
                    aria-label={pinned ? "Unpin" : "Pin"}
                    onClick={() => setPinned((p) => !p)}
                  >
                    <Icon name={pinned ? "check" : "plus"} size="xs" />
                  </button>
                )}
              </span>
            )}
          </span>
        )}
      </span>
    );
  },
);
