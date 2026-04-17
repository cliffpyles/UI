import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AuditLogLayout } from "./AuditLogLayout";

describe("AuditLogLayout", () => {
  it("renders the log region", () => {
    render(<AuditLogLayout log={<ul><li>entry</li></ul>} />);
    expect(screen.getByRole("region", { name: "Audit log" })).toBeInTheDocument();
    expect(screen.getByRole("log", { name: "Audit entries" })).toHaveTextContent("entry");
  });

  it("renders filters and detail slots", () => {
    render(
      <AuditLogLayout
        filters={<input aria-label="actor" />}
        log={<div>log</div>}
        detail={<div>detail body</div>}
      />,
    );
    expect(screen.getByRole("group", { name: "Audit filters" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Audit entry detail" })).toHaveTextContent(
      "detail body",
    );
  });

  it("does not render detail aside when no detail is provided", () => {
    render(<AuditLogLayout log={<div>log</div>} />);
    expect(screen.queryByRole("group", { name: "Audit entry detail" })).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<AuditLogLayout ref={ref} className="custom" log={<div>l</div>} />);
    expect(ref.current?.className).toContain("ui-audit-log");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AuditLogLayout
        filters={<label>Actor<input /></label>}
        log={<ul><li>entry</li></ul>}
        detail={<div>d</div>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
