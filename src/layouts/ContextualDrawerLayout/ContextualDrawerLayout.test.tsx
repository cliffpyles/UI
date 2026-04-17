import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ContextualDrawerLayout } from "./ContextualDrawerLayout";

describe("ContextualDrawerLayout", () => {
  it("renders main content and drawer", () => {
    render(
      <ContextualDrawerLayout
        open
        onClose={() => {}}
        drawer={<p>drawer body</p>}
        title="Details"
      >
        main area
      </ContextualDrawerLayout>,
    );
    expect(screen.getByText("main area")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("drawer body")).toBeInTheDocument();
  });

  it("marks drawer hidden when closed", () => {
    render(
      <ContextualDrawerLayout
        open={false}
        onClose={() => {}}
        drawer={<p>hidden</p>}
        title="Details"
      >
        main
      </ContextualDrawerLayout>,
    );
    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("aria-hidden", "true");
  });

  it("calls onClose on close button click", async () => {
    const onClose = vi.fn();
    render(
      <ContextualDrawerLayout open onClose={onClose} drawer={<p>x</p>} title="T">
        main
      </ContextualDrawerLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: /close drawer/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <ContextualDrawerLayout open onClose={onClose} drawer={<p>x</p>} title="T">
        main
      </ContextualDrawerLayout>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ContextualDrawerLayout open onClose={() => {}} drawer={<p>x</p>} title="T">
        main
      </ContextualDrawerLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
