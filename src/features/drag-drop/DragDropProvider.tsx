import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { DragDropContext, type DragEndEvent, type DragState } from "./DragDropContext";

export interface DragDropProviderProps {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragStart?: (activeId: string) => void;
}

export function DragDropProvider({ children, onDragEnd, onDragStart }: DragDropProviderProps) {
  const [state, setState] = useState<DragState>({ activeId: null, overId: null, sourceId: null });
  const [liveMessage, setLiveMessage] = useState("");
  const droppablesRef = useRef<Set<string>>(new Set());
  const [droppableIds, setDroppableIds] = useState<string[]>([]);

  const registerDroppable = useCallback((id: string) => {
    droppablesRef.current.add(id);
    setDroppableIds(Array.from(droppablesRef.current));
    return () => {
      droppablesRef.current.delete(id);
      setDroppableIds(Array.from(droppablesRef.current));
    };
  }, []);

  const registerDraggable = useCallback(() => {
    return () => {
      // no-op — individual draggables don't need central registration beyond drag state
    };
  }, []);

  const startDrag = useCallback(
    (activeId: string, sourceId: string | null) => {
      setState({ activeId, overId: sourceId, sourceId });
      onDragStart?.(activeId);
    },
    [onDragStart],
  );

  const setOver = useCallback((overId: string | null) => {
    setState((s) => (s.activeId ? { ...s, overId } : s));
  }, []);

  const endDrag = useCallback(
    (cancel = false) => {
      setState((s) => {
        if (!s.activeId) return s;
        if (!cancel) {
          onDragEnd?.({
            activeId: s.activeId,
            overId: s.overId,
            sourceId: s.sourceId,
            index: 0,
          });
        }
        return { activeId: null, overId: null, sourceId: null };
      });
    },
    [onDragEnd],
  );

  const announce = useCallback((msg: string) => setLiveMessage(msg), []);

  const value = useMemo(
    () => ({
      state,
      registerDraggable,
      registerDroppable,
      startDrag,
      setOver,
      endDrag,
      droppableIds,
      announce,
      liveMessage,
    }),
    [state, registerDraggable, registerDroppable, startDrag, setOver, endDrag, droppableIds, announce, liveMessage],
  );

  return (
    <DragDropContext value={value}>
      {children}
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {liveMessage}
      </div>
    </DragDropContext>
  );
}
