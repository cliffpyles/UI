import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DataTableToolbar } from "./DataTableToolbar";

describe("DataTableToolbar", () => {
  it("renders search", () => {
    render(<DataTableToolbar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("fires export", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<DataTableToolbar onExport={fn} />);
    await user.click(screen.getByRole("button", { name: /Export/ }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DataTableToolbar onSearch={() => {}} onExport={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
