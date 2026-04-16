import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  // --- Basic rendering ---

  it("renders page indicator", () => {
    render(<Pagination page={3} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Pagination page={3} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "First page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last page" })).toBeInTheDocument();
  });

  // --- Navigation ---

  it("calls onPageChange with page 1 when First is clicked", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "First page" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with previous page when Prev is clicked", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with next page when Next is clicked", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("calls onPageChange with last page when Last is clicked", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Last page" }));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  // --- Boundary disabling ---

  it("disables First and Previous on page 1", () => {
    render(<Pagination page={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Last page" })).not.toBeDisabled();
  });

  it("disables Next and Last on last page", () => {
    render(<Pagination page={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "First page" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
  });

  // --- Showing X-Y of Z ---

  it("renders showing label when totalItems and pageSize provided", () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        onPageChange={() => {}}
        pageSize={10}
        totalItems={42}
      />,
    );
    expect(screen.getByText("Showing 11\u201320 of 42")).toBeInTheDocument();
  });

  it("clamps end to totalItems on last page", () => {
    render(
      <Pagination
        page={5}
        totalPages={5}
        onPageChange={() => {}}
        pageSize={10}
        totalItems={42}
      />,
    );
    expect(screen.getByText("Showing 41\u201342 of 42")).toBeInTheDocument();
  });

  it("does not render showing label without totalItems", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  // --- Page size selector ---

  it("renders page size selector when onPageSizeChange is provided", () => {
    render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        pageSize={10}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByText("Rows per page:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("10");
  });

  it("calls onPageSizeChange when page size is changed", async () => {
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "25");
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  // --- Keyboard accessible ---

  it("buttons are keyboard accessible", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} totalPages={10} onPageChange={onPageChange} />);
    screen.getByRole("button", { name: "Next page" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  // --- Ref forwarding ---

  it("forwards ref to nav element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pagination ref={ref} page={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  // --- className merging ---

  it("merges custom className", () => {
    render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        className="custom"
      />,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("ui-pagination");
    expect(nav).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination page={3} totalPages={10} onPageChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with page size selector", async () => {
    const { container } = render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        pageSize={10}
        onPageSizeChange={() => {}}
        totalItems={42}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
