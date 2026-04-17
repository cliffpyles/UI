import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ExplorationNotebookLayout } from "./ExplorationNotebookLayout";

const cells = [
  { id: "a", content: <p>cell one</p> },
  { id: "b", content: <p>cell two</p> },
];

describe("ExplorationNotebookLayout", () => {
  it("renders cells in order", () => {
    render(<ExplorationNotebookLayout cells={cells} />);
    expect(screen.getByText("cell one")).toBeInTheDocument();
    expect(screen.getByText("cell two")).toBeInTheDocument();
  });

  it("renders add buttons between cells when onAddCell provided", () => {
    const onAddCell = vi.fn();
    render(<ExplorationNotebookLayout cells={cells} onAddCell={onAddCell} />);
    const adds = screen.getAllByRole("button", { name: /Add cell at position/ });
    expect(adds.length).toBe(cells.length + 1);
  });

  it("calls onAddCell with correct index", async () => {
    const onAddCell = vi.fn();
    render(<ExplorationNotebookLayout cells={cells} onAddCell={onAddCell} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Add cell at position 2" }),
    );
    expect(onAddCell).toHaveBeenCalledWith(1);
  });

  it("calls onRemoveCell when remove clicked", async () => {
    const onRemoveCell = vi.fn();
    render(
      <ExplorationNotebookLayout cells={cells} onRemoveCell={onRemoveCell} />,
    );
    const removes = screen.getAllByRole("button", { name: "Remove cell" });
    await userEvent.click(removes[0]);
    expect(onRemoveCell).toHaveBeenCalledWith("a");
  });

  it("uses custom renderCell", () => {
    render(
      <ExplorationNotebookLayout
        cells={cells}
        renderCell={(c) => <div>custom:{c.id}</div>}
      />,
    );
    expect(screen.getByText("custom:a")).toBeInTheDocument();
    expect(screen.getByText("custom:b")).toBeInTheDocument();
  });

  it("provides reorder handlers to renderCell", async () => {
    const onReorder = vi.fn();
    render(
      <ExplorationNotebookLayout
        cells={cells}
        onReorder={onReorder}
        renderCell={(c, h) => (
          <div>
            <span>{c.id}</span>
            {h.onMoveDown && (
              <button onClick={h.onMoveDown}>down-{c.id}</button>
            )}
          </div>
        )}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "down-a" }));
    expect(onReorder).toHaveBeenCalledWith(0, 1);
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ExplorationNotebookLayout ref={ref} className="extra" cells={cells} />,
    );
    expect(ref.current?.className).toContain("ui-notebook");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ExplorationNotebookLayout
        cells={cells}
        onAddCell={() => {}}
        onRemoveCell={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
