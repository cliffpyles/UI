import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MultiWorkspaceSwitcher, type Workspace } from "./MultiWorkspaceSwitcher";

const workspaces: Workspace[] = [
  { id: "acme", name: "Acme Corp", recent: true },
  { id: "beta", name: "Beta Inc", description: "Staging" },
  { id: "gamma", name: "Gamma LLC" },
];

describe("MultiWorkspaceSwitcher", () => {
  it("shows the active workspace name in the trigger", () => {
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /Acme Corp/ })).toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Acme Corp/ });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
  });

  it("shows Recent section when recent workspaces exist", async () => {
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("All workspaces")).toBeInTheDocument();
  });

  it("calls onSwitch when a workspace is selected", async () => {
    const onSwitch = vi.fn();
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={onSwitch}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Acme Corp/ }));
    await userEvent.click(screen.getByRole("button", { name: /Beta Inc/ }));
    expect(onSwitch).toHaveBeenCalledWith("beta");
  });

  it("filters by search query", async () => {
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    await userEvent.type(screen.getByLabelText(/search workspaces/i), "gamma");
    expect(screen.getByText("Gamma LLC")).toBeInTheDocument();
    expect(screen.queryByText("Beta Inc")).not.toBeInTheDocument();
  });

  it("renders create action", async () => {
    const onCreate = vi.fn();
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
        onCreate={onCreate}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Acme Corp/ }));
    await userEvent.click(screen.getByRole("button", { name: /create workspace/i }));
    expect(onCreate).toHaveBeenCalled();
  });

  it("marks active workspace with aria-current", async () => {
    render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Acme Corp/ }));
    const actives = screen.getAllByRole("button", { name: /Acme Corp/ });
    expect(actives.some((el) => el.getAttribute("aria-current") === "true")).toBe(true);
  });

  it("has no axe violations when open", async () => {
    const { container } = render(
      <MultiWorkspaceSwitcher
        workspaces={workspaces}
        activeId="acme"
        onSwitch={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(await axe(container)).toHaveNoViolations();
  });
});
