import { createContext } from "react";

export interface DragEndEvent {
  /** The id of the dragged item. */
  activeId: string;
  /** The id of the drop zone the item was dropped into. Null if cancelled. */
  overId: string | null;
  /** The id of the source drop zone. */
  sourceId: string | null;
  /** The index within the destination drop zone (best-effort). */
  index: number;
}

export interface DragState {
  activeId: string | null;
  overId: string | null;
  sourceId: string | null;
}

export interface DragDropContextValue {
  state: DragState;
  registerDraggable: () => () => void;
  registerDroppable: (id: string) => () => void;
  startDrag: (activeId: string, sourceId: string | null) => void;
  setOver: (overId: string | null) => void;
  endDrag: (cancel?: boolean) => void;
  /** Keyboard focus cycling within droppables. */
  droppableIds: string[];
  announce: (message: string) => void;
  liveMessage: string;
}

export const DragDropContext = createContext<DragDropContextValue | null>(null);
