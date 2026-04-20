import { describe, it, expect, vi } from "vitest";
import { render, screen, renderHook, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DataTable, type DataTableColumn } from "./DataTable";
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

const COLS: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: (r) => r.name, sortable: true },
  { id: "age", header: "Age", accessor: (r) => r.age, numeric: true, sortable: true },
];

describe("DataTable", () => {
  it("renders rows", () => {
    render(<DataTable columns={COLS} rows={DATA} rowKey={(r) => r.id} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<DataTable<Row> columns={COLS} rows={[]} rowKey={(r) => r.id} />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <DataTable<Row>
        columns={COLS}
        rows={[]}
        rowKey={(r) => r.id}
        error="Network error"
      />,
    );
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("announces aria-busy while loading", () => {
    render(
      <DataTable<Row>
        columns={COLS}
        rows={[]}
        rowKey={(r) => r.id}
        loading
      />,
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  });

  it("skeleton rows count matches pageSize", () => {
    const { container } = render(
      <DataTable<Row>
        columns={COLS}
        rows={[]}
        rowKey={(r) => r.id}
        loading
        pagination={{ page: 1, pageSize: 7, total: 0, onPageChange: () => {} }}
      />,
    );
    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows.length).toBe(7);
  });

  it("fires sort change with next SortState", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <DataTable columns={COLS} rows={DATA} rowKey={(r) => r.id} onSortChange={fn} />,
    );
    await user.click(screen.getByText("Name"));
    expect(fn).toHaveBeenCalledWith({ column: "name", direction: "asc" });
  });

  it("selects rows via Set", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={DATA}
        rowKey={(r) => r.id}
        selection={new Set()}
        onSelectionChange={fn}
      />,
    );
    await user.click(screen.getByLabelText("Select row 1"));
    const next = fn.mock.calls[0][0] as Set<string>;
    expect(Array.from(next)).toEqual(["1"]);
  });

  it("header checkbox toggles all rows", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={DATA}
        rowKey={(r) => r.id}
        selection={new Set()}
        onSelectionChange={fn}
      />,
    );
    await user.click(screen.getByLabelText("Select all rows"));
    const next = fn.mock.calls[0][0] as Set<string>;
    expect(Array.from(next).sort()).toEqual(["1", "2"]);
  });

  it("invokes pagination onPageChange", () => {
    const fn = vi.fn();
    render(
      <DataTable
        columns={COLS}
        rows={DATA}
        rowKey={(r) => r.id}
        pagination={{ page: 1, pageSize: 1, total: 5, onPageChange: fn }}
      />,
    );
    const next = screen.getByRole("button", { name: /next/i });
    fireEvent.click(next);
    expect(fn).toHaveBeenCalled();
  });

  it("respects visibleColumns order and visibility", () => {
    render(
      <DataTable
        columns={COLS}
        rows={DATA}
        rowKey={(r) => r.id}
        visibleColumns={["age"]}
      />,
    );
    expect(screen.queryByText("Name")).toBeNull();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DataTable columns={COLS} rows={DATA} rowKey={(r) => r.id} />,
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
