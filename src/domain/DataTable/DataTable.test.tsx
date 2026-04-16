import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DataTable } from "./DataTable";
import { useDataTableState } from "./useDataTableState";

interface Row {
  id: string;
  name: string;
  age: number;
}

const DATA: Row[] = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
];

const COLS = [
  { id: "name", header: "Name", accessor: "name" as const, sortable: true },
  { id: "age", header: "Age", accessor: "age" as const, numeric: true, sortable: true },
];

describe("DataTable", () => {
  it("renders rows", () => {
    render(<DataTable columns={COLS} data={DATA} rowKey={(r) => r.id} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<DataTable<Row> columns={COLS} data={[]} rowKey={(r) => r.id} />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <DataTable<Row>
        columns={COLS}
        data={[]}
        rowKey={(r) => r.id}
        error="Network error"
      />,
    );
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("fires sort change", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <DataTable columns={COLS} data={DATA} rowKey={(r) => r.id} onSortChange={fn} />,
    );
    await user.click(screen.getByText("Name"));
    expect(fn).toHaveBeenCalledWith("name");
  });

  it("selects rows", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <DataTable
        columns={COLS}
        data={DATA}
        rowKey={(r) => r.id}
        selectable
        selected={[]}
        onSelectedChange={fn}
      />,
    );
    await user.click(screen.getByLabelText("Select row 1"));
    expect(fn).toHaveBeenCalledWith(["1"]);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DataTable columns={COLS} data={DATA} rowKey={(r) => r.id} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("useDataTableState", () => {
  it("cycles sort asc -> desc -> none", () => {
    const { result } = renderHook(() => useDataTableState());
    act(() => result.current.props.onSortChange("x"));
    expect(result.current.sort).toEqual({ column: "x", direction: "asc" });
    act(() => result.current.props.onSortChange("x"));
    expect(result.current.sort).toEqual({ column: "x", direction: "desc" });
    act(() => result.current.props.onSortChange("x"));
    expect(result.current.sort).toBeNull();
  });

  it("resets page on pageSize change", () => {
    const { result } = renderHook(() => useDataTableState());
    act(() => result.current.props.onPageChange(3));
    expect(result.current.pagination.page).toBe(3);
    act(() => result.current.props.onPageSizeChange(50));
    expect(result.current.pagination.page).toBe(1);
    expect(result.current.pagination.pageSize).toBe(50);
  });
});
