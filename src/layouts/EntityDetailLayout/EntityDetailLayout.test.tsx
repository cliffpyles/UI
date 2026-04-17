import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EntityDetailLayout } from "./EntityDetailLayout";

describe("EntityDetailLayout", () => {
  it("renders title and children", () => {
    render(
      <EntityDetailLayout title="Project Alpha">
        <p>body</p>
      </EntityDetailLayout>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Project Alpha" })).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("renders subtitle, meta, and actions", () => {
    render(
      <EntityDetailLayout
        title="Alpha"
        subtitle="active project"
        meta={<span>Owner: Sam</span>}
        actions={<button>Edit</button>}
      >
        body
      </EntityDetailLayout>,
    );
    expect(screen.getByText("active project")).toBeInTheDocument();
    expect(screen.getByText("Owner: Sam")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <EntityDetailLayout
        title="Alpha"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Alpha" },
        ]}
      >
        body
      </EntityDetailLayout>,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders section slot", () => {
    render(
      <EntityDetailLayout title="Alpha">
        <EntityDetailLayout.Section heading="Overview">
          <p>overview body</p>
        </EntityDetailLayout.Section>
      </EntityDetailLayout>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("overview body")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EntityDetailLayout title="Alpha" subtitle="x" actions={<button>Edit</button>}>
        <EntityDetailLayout.Section heading="Overview">body</EntityDetailLayout.Section>
      </EntityDetailLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
