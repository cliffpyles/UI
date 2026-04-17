import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EmptyStateScaffoldLayout } from "./EmptyStateScaffoldLayout";

describe("EmptyStateScaffoldLayout", () => {
  it("renders title, description and actions", () => {
    render(
      <EmptyStateScaffoldLayout
        title="No projects yet"
        description="Create your first project to get started."
        primaryAction={<button>Create project</button>}
        secondaryAction={<button>Learn more</button>}
      />,
    );
    const region = screen.getByRole("region", { name: "Empty state" });
    expect(region).toHaveTextContent("No projects yet");
    expect(region).toHaveTextContent("Create your first project");
    expect(
      screen.getByRole("button", { name: "Create project" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learn more" }),
    ).toBeInTheDocument();
  });

  it("renders steps list", () => {
    render(
      <EmptyStateScaffoldLayout
        title="Setup"
        steps={[<span>Connect a source</span>, <span>Import data</span>]}
      />,
    );
    const list = screen.getByRole("list", { name: "Getting started steps" });
    expect(list).toBeInTheDocument();
    expect(screen.getByText("Connect a source")).toBeInTheDocument();
    expect(screen.getByText("Import data")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <EmptyStateScaffoldLayout
        ref={ref}
        title="Empty"
        className="custom"
        data-testid="scaffold"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("scaffold")).toHaveClass(
      "ui-empty-state-scaffold",
      "custom",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EmptyStateScaffoldLayout
        title="No data"
        description="Add a data source"
        primaryAction={<button>Add</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
