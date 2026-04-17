import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PopoverPeekLayout } from "./PopoverPeekLayout";

describe("PopoverPeekLayout", () => {
  it("renders trigger", () => {
    render(
      <PopoverPeekLayout content={<p>peek</p>} trigger="click">
        <button>open</button>
      </PopoverPeekLayout>,
    );
    expect(screen.getByRole("button", { name: "open" })).toBeInTheDocument();
    expect(screen.queryByText("peek")).not.toBeInTheDocument();
  });

  it("opens on click when trigger=click", async () => {
    render(
      <PopoverPeekLayout content={<p>peek</p>} trigger="click">
        <button>open</button>
      </PopoverPeekLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByText("peek")).toBeInTheDocument();
  });

  it("dismisses on outside click", async () => {
    render(
      <div>
        <PopoverPeekLayout content={<p>peek</p>} trigger="click">
          <button>open</button>
        </PopoverPeekLayout>
        <button>outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByText("peek")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByText("peek")).not.toBeInTheDocument();
  });

  it("renders pin toggle and actions", async () => {
    render(
      <PopoverPeekLayout
        content={<p>peek</p>}
        actions={<button>Go</button>}
        pinnable
        trigger="click"
      >
        <button>open</button>
      </PopoverPeekLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    const pin = screen.getByRole("button", { name: /^pin$/i });
    expect(pin).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(pin);
    expect(pin).toHaveAttribute("aria-pressed", "true");
  });

  it("has no axe violations when open", async () => {
    const { container } = render(
      <PopoverPeekLayout content={<p>peek</p>} trigger="click">
        <button>open</button>
      </PopoverPeekLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: "open" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
