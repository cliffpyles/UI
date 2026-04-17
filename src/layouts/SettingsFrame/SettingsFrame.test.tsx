import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SettingsFrame } from "./SettingsFrame";

const categories = [
  { id: "general", label: "General" },
  { id: "billing", label: "Billing", description: "Manage plan" },
  { id: "api", label: "API", disabled: true },
];

describe("SettingsFrame", () => {
  it("renders nav with categories and content", () => {
    render(
      <SettingsFrame categories={categories} activeId="general" onChange={() => {}}>
        <p>content</p>
      </SettingsFrame>,
    );
    expect(screen.getByRole("navigation", { name: /settings categories/i })).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("marks active category", () => {
    render(
      <SettingsFrame categories={categories} activeId="billing" onChange={() => {}}>
        <div />
      </SettingsFrame>,
    );
    expect(screen.getByRole("button", { name: /Billing/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("calls onChange when clicking a category", async () => {
    const onChange = vi.fn();
    render(
      <SettingsFrame categories={categories} activeId="general" onChange={onChange}>
        <div />
      </SettingsFrame>,
    );
    await userEvent.click(screen.getByRole("button", { name: /Billing/ }));
    expect(onChange).toHaveBeenCalledWith("billing");
  });

  it("disables disabled categories", () => {
    render(
      <SettingsFrame categories={categories} activeId="general" onChange={() => {}}>
        <div />
      </SettingsFrame>,
    );
    expect(screen.getByRole("button", { name: /API/i })).toBeDisabled();
  });

  it("renders optional heading", () => {
    render(
      <SettingsFrame
        categories={categories}
        activeId="general"
        onChange={() => {}}
        heading="Workspace"
      >
        <div />
      </SettingsFrame>,
    );
    expect(screen.getByText("Workspace")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SettingsFrame categories={categories} activeId="general" onChange={() => {}}>
        <div />
      </SettingsFrame>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
