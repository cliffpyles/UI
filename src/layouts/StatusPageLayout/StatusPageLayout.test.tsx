import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import { axe } from "vitest-axe";
import { StatusPageLayout, type StatusPageSystem } from "./StatusPageLayout";

const systems: StatusPageSystem[] = [
  { id: "api", name: "API", status: "operational", uptime: "99.99%" },
  { id: "web", name: "Web", status: "degraded", description: "Slow responses" },
  { id: "db", name: "DB", status: "outage" },
  { id: "cache", name: "Cache", status: "maintenance" },
];

describe("StatusPageLayout", () => {
  it("renders systems grid with status labels", () => {
    render(<StatusPageLayout systems={systems} />);
    expect(
      screen.getByRole("region", { name: "Systems status" }),
    ).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Operational")).toBeInTheDocument();
    expect(screen.getByText("Degraded")).toBeInTheDocument();
    expect(screen.getByText("Outage")).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders header and incidents slots", () => {
    render(
      <StatusPageLayout
        systems={systems}
        header={<h1>All Systems</h1>}
        incidents={<p>No active incidents</p>}
      />,
    );
    expect(screen.getByRole("heading", { name: "All Systems" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Incidents" }),
    ).toHaveTextContent("No active incidents");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <StatusPageLayout systems={systems} ref={ref} className="custom" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-status-page", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<StatusPageLayout systems={systems} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
