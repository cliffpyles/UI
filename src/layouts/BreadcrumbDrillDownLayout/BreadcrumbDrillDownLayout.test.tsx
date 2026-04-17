import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BreadcrumbDrillDownLayout, type DrillLevel } from "./BreadcrumbDrillDownLayout";

const levels: DrillLevel[] = [
  { id: "a", label: "Level A", content: <div>content a</div> },
  { id: "b", label: "Level B", content: <div>content b</div> },
];

describe("BreadcrumbDrillDownLayout", () => {
  it("renders breadcrumbs and current content", () => {
    render(<BreadcrumbDrillDownLayout levels={levels} rootLabel="Home" />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("content b")).toBeInTheDocument();
    expect(screen.queryByText("content a")).not.toBeInTheDocument();
  });

  it("navigates to previous level on crumb click", async () => {
    const onNavigate = vi.fn();
    render(
      <BreadcrumbDrillDownLayout levels={levels} onNavigate={onNavigate} rootLabel="Home" />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Level A" }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it("navigates to root on root click", async () => {
    const onNavigate = vi.fn();
    render(
      <BreadcrumbDrillDownLayout levels={levels} onNavigate={onNavigate} rootLabel="Home" />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(onNavigate).toHaveBeenCalledWith(-1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<BreadcrumbDrillDownLayout levels={levels} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
