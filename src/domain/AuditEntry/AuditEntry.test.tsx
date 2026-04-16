import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AuditEntry } from "./AuditEntry";

const ENTRY = {
  id: "1",
  actor: { name: "Jane" },
  action: "deleted",
  resource: "Project Apollo",
  timestamp: new Date(),
  ip: "192.168.1.1",
};

describe("AuditEntry", () => {
  it("renders action and resource", () => {
    render(<AuditEntry entry={ENTRY} />);
    expect(screen.getByText("deleted")).toBeInTheDocument();
    expect(screen.getByText("Project Apollo")).toBeInTheDocument();
  });

  it("renders meta", () => {
    render(<AuditEntry entry={ENTRY} />);
    expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<AuditEntry entry={ENTRY} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
