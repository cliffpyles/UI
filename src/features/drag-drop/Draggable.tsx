import {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { DragDropContext } from "./DragDropContext";
import { DroppableIdContext } from "./DroppableIdContext";
import "./DragDrop.css";

export interface DraggableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  disabled?: boolean;
  children: ReactNode;
}

export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(function Draggable(
  { id, disabled = false, children, className, onKeyDown, ...rest },
  ref,
) {
  const ctx = useContext(DragDropContext);
  const sourceId = useContext(DroppableIdContext);
  const localRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef(ctx);

  useEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    const c = ctxRef.current;
    if (!c) return;
    return c.registerDraggable();
  }, [id]);

  if (!ctx) {
    return (
      <div ref={ref} className={["ui-draggable", className].filter(Boolean).join(" ")} {...rest}>
        {children}
      </div>
    );
  }

  const isActive = ctx.state.activeId === id;

  const handleMouseDown = () => {
    if (disabled) return;
    ctx.startDrag(id, sourceId);
    ctx.announce(`Picked up ${id}`);

    const onMove = () => {
      // pointer tracking is informational — real libraries inspect elementFromPoint
    };
    const onUp = () => {
      ctx.endDrag();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (disabled) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!isActive) {
        ctx.startDrag(id, sourceId);
        ctx.announce(`Picked up ${id}. Use arrow keys to move, space to drop, escape to cancel.`);
      } else {
        ctx.endDrag();
        ctx.announce(`Dropped ${id} on ${ctx.state.overId ?? "original position"}`);
      }
      return;
    }
    if (e.key === "Escape" && isActive) {
      e.preventDefault();
      ctx.endDrag(true);
      ctx.announce(`Cancelled drag of ${id}`);
      return;
    }
    if (isActive && (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp")) {
      e.preventDefault();
      const ids = ctx.droppableIds;
      const currentIndex = ids.indexOf(ctx.state.overId ?? sourceId ?? "");
      const direction = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(ids.length - 1, currentIndex + direction));
      const next = ids[nextIndex] ?? null;
      if (next) {
        ctx.setOver(next);
        ctx.announce(`Over ${next}`);
      }
    }
  };

  const classes = [
    "ui-draggable",
    isActive && "ui-draggable--dragging",
    disabled && "ui-draggable--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={classes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-grabbed={isActive ? "true" : "false"}
      aria-disabled={disabled || undefined}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      data-draggable-id={id}
      {...rest}
    >
      {children}
    </div>
  );
});
