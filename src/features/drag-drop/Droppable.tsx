import {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { DragDropContext, type DragDropContextValue } from "./DragDropContext";
import { DroppableIdContext } from "./DroppableIdContext";
import "./DragDrop.css";

export interface DroppableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  /** Whether this zone accepts drops. */
  accepts?: (draggedId: string) => boolean;
  children: ReactNode;
}

export const Droppable = forwardRef<HTMLDivElement, DroppableProps>(function Droppable(
  { id, accepts, children, className, onMouseEnter, onMouseLeave, ...rest },
  ref,
) {
  const ctx = useContext(DragDropContext);
  const ctxRef = useRef<DragDropContextValue | null>(ctx);

  useEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    const c = ctxRef.current;
    if (!c) return;
    return c.registerDroppable(id);
  }, [id]);

  if (!ctx) {
    return (
      <div ref={ref} className={["ui-droppable", className].filter(Boolean).join(" ")} {...rest}>
        <DroppableIdContext value={id}>{children}</DroppableIdContext>
      </div>
    );
  }

  const draggedId = ctx.state.activeId;
  const isOver = ctx.state.overId === id && draggedId !== null;
  const isValid = draggedId !== null && (accepts ? accepts(draggedId) : true);

  const classes = [
    "ui-droppable",
    isOver && isValid && "ui-droppable--over",
    isOver && !isValid && "ui-droppable--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);
    if (ctx.state.activeId) ctx.setOver(id);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (ctx.state.activeId && ctx.state.overId === id) ctx.setOver(null);
  };

  return (
    <div
      ref={ref}
      className={classes}
      data-droppable-id={id}
      aria-dropeffect={isValid ? "move" : "none"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <DroppableIdContext value={id}>{children}</DroppableIdContext>
    </div>
  );
});
