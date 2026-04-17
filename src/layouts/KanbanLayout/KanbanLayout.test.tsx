import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { KanbanLayout, type KanbanColumn } from "./KanbanLayout";

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To do",
    cards: [<div key="1">card-1</div>, <div key="2">card-2</div>],
  },
  {
    id: "doing",
    title: "Doing",
    cards: [<div key="3">card-3</div>],
    wipLimit: 3,
  },
];

describe("KanbanLayout", () => {
  it("renders columns with titles and cards", () => {
    render(<KanbanLayout columns={columns} toolbar={<button>Add</button>} />);
    expect(screen.getByRole("region", { name: "Kanban board" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("To do")).toBeInTheDocument();
    expect(screen.getByText("Doing")).toBeInTheDocument();
    expect(screen.getByText("card-1")).toBeInTheDocument();
    expect(screen.getByText("card-2")).toBeInTheDocument();
    expect(screen.getByText("card-3")).toBeInTheDocument();
  });

  it("shows WIP limit count when wipLimit is set", () => {
    render(<KanbanLayout columns={columns} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("uses renderColumn when provided", () => {
    render(
      <KanbanLayout
        columns={columns}
        renderColumn={(col) => <div data-testid={`col-${col.id}`}>custom-{col.id}</div>}
      />,
    );
    expect(screen.getByText("custom-todo")).toBeInTheDocument();
    expect(screen.getByText("custom-doing")).toBeInTheDocument();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<KanbanLayout ref={ref} className="extra" columns={columns} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-kanban-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(<KanbanLayout columns={columns} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
