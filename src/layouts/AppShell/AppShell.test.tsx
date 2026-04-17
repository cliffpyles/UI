import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders all slots with landmark roles", () => {
    render(
      <AppShell>
        <AppShell.Header>Top</AppShell.Header>
        <AppShell.Sidebar>Side</AppShell.Sidebar>
        <AppShell.Main>Body</AppShell.Main>
      </AppShell>,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("Top");
    expect(screen.getByRole("complementary")).toHaveTextContent("Side");
    expect(screen.getByRole("main")).toHaveTextContent("Body");
  });

  it("allows omitting slots", () => {
    render(
      <AppShell>
        <AppShell.Main>only main</AppShell.Main>
      </AppShell>,
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("adds collapsed class when sidebarCollapsed", () => {
    render(<AppShell sidebarCollapsed data-testid="root" />);
    expect(screen.getByTestId("root")).toHaveClass("ui-app-shell--collapsed");
  });

  it("sets custom sidebar width via style", () => {
    render(<AppShell sidebarWidth={300} data-testid="root" />);
    expect(screen.getByTestId("root").style.getPropertyValue("--ui-app-shell-sidebar-width")).toBe(
      "300px",
    );
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AppShell ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    render(<AppShell className="x" data-testid="root" />);
    expect(screen.getByTestId("root")).toHaveClass("ui-app-shell", "x");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AppShell>
        <AppShell.Header>Top</AppShell.Header>
        <AppShell.Sidebar>Side</AppShell.Sidebar>
        <AppShell.Main>Body</AppShell.Main>
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
