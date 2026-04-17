import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { IntegrationHubLayout } from "./IntegrationHubLayout";

const categories = [
  { id: "comm", label: "Communication" },
  { id: "dev", label: "Developer" },
];

const integrations = [
  {
    id: "slack",
    name: "Slack",
    category: "comm",
    status: "connected" as const,
    description: "Chat",
  },
  {
    id: "github",
    name: "GitHub",
    category: "dev",
    status: "error" as const,
    description: "Code",
  },
  {
    id: "jira",
    name: "Jira",
    category: "dev",
    status: "disconnected" as const,
  },
];

describe("IntegrationHubLayout", () => {
  it("renders integrations and categories", () => {
    render(
      <IntegrationHubLayout
        categories={categories}
        integrations={integrations}
      />,
    );
    expect(screen.getByRole("region", { name: "Integration hub" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Slack/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Communication/ })).toBeInTheDocument();
  });

  it("filters integrations when category clicked", async () => {
    render(
      <IntegrationHubLayout
        categories={categories}
        integrations={integrations}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Developer/ }));
    expect(screen.queryByRole("button", { name: /Slack/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Jira/ })).toBeInTheDocument();
  });

  it("calls onSelect when integration clicked", async () => {
    const onSelect = vi.fn();
    render(
      <IntegrationHubLayout
        categories={categories}
        integrations={integrations}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Slack/ }));
    expect(onSelect).toHaveBeenCalledWith("slack");
  });

  it("renders toolbar slot", () => {
    render(
      <IntegrationHubLayout
        categories={categories}
        integrations={integrations}
        toolbar={<input aria-label="search" />}
      />,
    );
    expect(screen.getByRole("textbox", { name: "search" })).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <IntegrationHubLayout
        ref={ref}
        className="custom"
        categories={categories}
        integrations={integrations}
      />,
    );
    expect(ref.current?.className).toContain("ui-integration-hub");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <IntegrationHubLayout
        categories={categories}
        integrations={integrations}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
