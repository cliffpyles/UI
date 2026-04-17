import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

const items = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Alpha", href: "/projects/alpha" },
  { label: "Settings" },
];

describe("Breadcrumbs", () => {
  it("renders all items", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("marks last item as current", () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText("Settings");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("renders anchor links when href is present", () => {
    render(<Breadcrumbs items={items} />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("invokes onClick handlers", async () => {
    const onClick = vi.fn();
    render(<Breadcrumbs items={[{ label: "A", onClick }, { label: "B" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("collapses when maxItems exceeded", () => {
    render(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.queryByText("Projects")).not.toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("uses nav landmark with default aria-label", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("accepts custom separator", () => {
    render(<Breadcrumbs items={items.slice(0, 2)} separator=">" />);
    expect(screen.getByText(">")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={items} />);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("merges className", () => {
    render(<Breadcrumbs items={items} className="x" data-testid="b" />);
    expect(screen.getByTestId("b")).toHaveClass("ui-breadcrumbs", "x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Breadcrumbs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
