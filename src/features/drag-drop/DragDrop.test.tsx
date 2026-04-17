import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DragDropProvider } from "./DragDropProvider";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

function App({ onDragEnd = vi.fn() }: { onDragEnd?: (e: unknown) => void }) {
  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <Droppable id="col-1">
        <Draggable id="card-1"><span>Card 1</span></Draggable>
      </Droppable>
      <Droppable id="col-2">
        <Draggable id="card-2"><span>Card 2</span></Draggable>
      </Droppable>
    </DragDropProvider>
  );
}

function getDraggable(id: string): HTMLElement {
  return document.querySelector(`[data-draggable-id="${id}"]`) as HTMLElement;
}

function getDroppable(id: string): HTMLElement {
  return document.querySelector(`[data-droppable-id="${id}"]`) as HTMLElement;
}

describe("DragDrop", () => {
  it("picks up and drops via keyboard", () => {
    const onDragEnd = vi.fn();
    render(<App onDragEnd={onDragEnd} />);
    const card1 = getDraggable("card-1");
    card1.focus();
    fireEvent.keyDown(card1, { key: " " });
    expect(card1.getAttribute("aria-grabbed")).toBe("true");
    fireEvent.keyDown(card1, { key: "ArrowRight" });
    fireEvent.keyDown(card1, { key: " " });
    expect(onDragEnd).toHaveBeenCalled();
    const evt = onDragEnd.mock.calls[0][0] as { activeId: string; overId: string | null };
    expect(evt.activeId).toBe("card-1");
    expect(evt.overId).toBe("col-2");
  });

  it("cancels drag on escape", () => {
    const onDragEnd = vi.fn();
    render(<App onDragEnd={onDragEnd} />);
    const card1 = getDraggable("card-1");
    fireEvent.keyDown(card1, { key: " " });
    fireEvent.keyDown(card1, { key: "Escape" });
    expect(onDragEnd).not.toHaveBeenCalled();
    expect(card1.getAttribute("aria-grabbed")).toBe("false");
  });

  it("highlights drop zone on mouse enter during drag", () => {
    render(<App />);
    const card1 = getDraggable("card-1");
    fireEvent.mouseDown(card1);
    const col2 = getDroppable("col-2");
    fireEvent.mouseEnter(col2);
    expect(col2.className).toContain("ui-droppable--over");
    fireEvent.mouseUp(window);
  });

  it("marks invalid drop zones", () => {
    render(
      <DragDropProvider>
        <Droppable id="col-1">
          <Draggable id="card-1"><span>Card 1</span></Draggable>
        </Droppable>
        <Droppable id="col-2" accepts={() => false}>
          <div>drop here</div>
        </Droppable>
      </DragDropProvider>,
    );
    const card1 = getDraggable("card-1");
    fireEvent.mouseDown(card1);
    const col2 = getDroppable("col-2");
    fireEvent.mouseEnter(col2);
    expect(col2.className).toContain("ui-droppable--invalid");
    fireEvent.mouseUp(window);
  });

  it("is accessible", async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
