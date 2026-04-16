import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- Basic rendering ---

  it("renders with placeholder", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders search icon", () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector(".ui-search-input__icon")).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(<SearchInput placeholder="Find items..." />);
    expect(screen.getByPlaceholderText("Find items...")).toBeInTheDocument();
  });

  // --- Clear button ---

  it("shows clear button when value is non-empty", () => {
    render(<SearchInput value="test" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  it("clears value and focuses input when clear is clicked", async () => {
    const onChange = vi.fn();
    render(<SearchInput defaultValue="test" onChange={onChange} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  // --- Debounced onChange ---

  it("fires onChange after debounce delay", async () => {
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} debounce={300} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.type(screen.getByRole("searchbox"), "abc");
    // onChange should not have been called yet with full value
    expect(onChange).not.toHaveBeenCalledWith("abc");
    // Advance timers past debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  // --- Escape key ---

  it("clears input on Escape key", async () => {
    const onChange = vi.fn();
    render(<SearchInput defaultValue="test" onChange={onChange} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const input = screen.getByRole("searchbox");
    await user.click(input);
    await user.keyboard("{Escape}");
    expect(onChange).toHaveBeenCalledWith("");
  });

  // --- Enter key ---

  it("fires onSearch on Enter key", async () => {
    const onSearch = vi.fn();
    render(<SearchInput defaultValue="query" onSearch={onSearch} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const input = screen.getByRole("searchbox");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(onSearch).toHaveBeenCalledWith("query");
  });

  // --- Loading state ---

  it("shows spinner when loading", () => {
    const { container } = render(<SearchInput loading />);
    expect(container.querySelector(".ui-spinner")).toBeInTheDocument();
  });

  it("hides search icon when loading", () => {
    const { container } = render(<SearchInput loading />);
    // Should have spinner, not the search SVG (search icon has a line element)
    const icon = container.querySelector(".ui-search-input__icon");
    expect(icon?.querySelector("line")).not.toBeInTheDocument();
  });

  // --- Size variants ---

  it("applies sm size class", () => {
    const { container } = render(<SearchInput size="sm" />);
    expect(container.firstChild).toHaveClass("ui-search-input--sm");
  });

  it("defaults to md size", () => {
    const { container } = render(<SearchInput />);
    expect(container.firstChild).toHaveClass("ui-search-input--md");
  });

  it("applies lg size class", () => {
    const { container } = render(<SearchInput size="lg" />);
    expect(container.firstChild).toHaveClass("ui-search-input--lg");
  });

  // --- Controlled mode ---

  it("works in controlled mode", () => {
    render(<SearchInput value="controlled" onChange={() => {}} />);
    expect(screen.getByRole("searchbox")).toHaveValue("controlled");
  });

  // --- Uncontrolled mode ---

  it("works in uncontrolled mode with defaultValue", () => {
    render(<SearchInput defaultValue="initial" />);
    expect(screen.getByRole("searchbox")).toHaveValue("initial");
  });

  // --- Ref forwarding ---

  it("forwards ref to input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("search");
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(<SearchInput className="custom" />);
    expect(container.firstChild).toHaveClass("ui-search-input");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Disabled ---

  it("disables input when disabled", () => {
    render(<SearchInput disabled />);
    expect(screen.getByRole("searchbox")).toBeDisabled();
  });

  it("does not show clear button when disabled", () => {
    render(<SearchInput value="test" onChange={() => {}} disabled />);
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<SearchInput />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with value", async () => {
    const { container } = render(
      <SearchInput value="test" onChange={() => {}} aria-label="Search items" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
