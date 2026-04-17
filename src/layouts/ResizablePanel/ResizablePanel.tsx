import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import "./ResizablePanel.css";

export type ResizeDirection = "horizontal" | "vertical";

export interface ResizablePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
  direction?: ResizeDirection;
  size: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  onResize: (size: number) => void;
  handlePosition?: "start" | "end";
  handleLabel?: string;
  disabled?: boolean;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  function ResizablePanel(
    {
      direction = "horizontal",
      size,
      minSize = 120,
      maxSize = 800,
      step = 16,
      onResize,
      handlePosition = "end",
      handleLabel = "Resize panel",
      disabled,
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const startRef = useRef({ pos: 0, size: 0 });
    const [dragging, setDragging] = useState(false);

    const setRefs = (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const clamp = useCallback(
      (v: number) => Math.max(minSize, Math.min(maxSize, v)),
      [minSize, maxSize],
    );

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startRef.current = {
        pos: direction === "horizontal" ? e.clientX : e.clientY,
        size,
      };
      setDragging(true);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const delta =
        (direction === "horizontal" ? e.clientX : e.clientY) - startRef.current.pos;
      const sign = handlePosition === "end" ? 1 : -1;
      onResize(clamp(startRef.current.size + sign * delta));
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDragging(false);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const decrease = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const increase = direction === "horizontal" ? "ArrowRight" : "ArrowDown";
      if (e.key === decrease) {
        e.preventDefault();
        onResize(clamp(size - step));
      } else if (e.key === increase) {
        e.preventDefault();
        onResize(clamp(size + step));
      } else if (e.key === "Home") {
        e.preventDefault();
        onResize(minSize);
      } else if (e.key === "End") {
        e.preventDefault();
        onResize(maxSize);
      }
    };

    useEffect(() => {
      if (!dragging) return;
      const prev = document.body.style.cursor;
      document.body.style.cursor =
        direction === "horizontal" ? "col-resize" : "row-resize";
      return () => {
        document.body.style.cursor = prev;
      };
    }, [dragging, direction]);

    const sizeProp = direction === "horizontal" ? "width" : "height";
    const classes = [
      "ui-resizable-panel",
      `ui-resizable-panel--${direction}`,
      `ui-resizable-panel--handle-${handlePosition}`,
      dragging && "ui-resizable-panel--dragging",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handle = (
      <div
        role="separator"
        aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
        aria-valuenow={size}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-label={handleLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className="ui-resizable-panel__handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
    );

    return (
      <div
        ref={setRefs}
        className={classes}
        style={{ [sizeProp]: size, ...style }}
        {...rest}
      >
        {handlePosition === "start" && handle}
        <div className="ui-resizable-panel__content">{children}</div>
        {handlePosition === "end" && handle}
      </div>
    );
  },
);
