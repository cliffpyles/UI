import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AuditEntry } from "./AuditEntry";

const BASE = {
  actor: { name: "Jane" },
  action: "user.login",
  occurredAt: new Date(),
} as const;

describe("AuditEntry", () => {
  it("renders actor, action, and timestamp in an <article>", () => {
    const { container } = render(<AuditEntry {...BASE} ip="10.0.0.1" />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("user.login")).toBeInTheDocument();
    expect(container.querySelector("article")).not.toBeNull();
    expect(container.querySelector(".ui-timestamp")).not.toBeNull();
    expect(container.querySelector(".ui-user-chip")).not.toBeNull();
  });

  it("renders IP and user-agent with a monospace Text", () => {
    const { container } = render(
      <AuditEntry
        {...BASE}
        ip="10.0.0.1"
        userAgent="Mozilla/5.0"
      />,
    );
    expect(screen.getByText("10.0.0.1")).toBeInTheDocument();
    expect(screen.getByText("Mozilla/5.0")).toBeInTheDocument();
    const mono = container.querySelectorAll(".ui-text--mono");
    expect(mono.length).toBeGreaterThanOrEqual(2);
  });

  it("omits ip/user-agent slots cleanly when not provided", () => {
    const { container } = render(<AuditEntry {...BASE} />);
    expect(container.querySelector(".ui-audit-entry__meta")).toBeNull();
  });

  it("renders the detail slot", () => {
    render(<AuditEntry {...BASE} detail="Resource: projects/42" />);
    expect(screen.getByText("Resource: projects/42")).toBeInTheDocument();
  });

  it("forwards ref and spreads props to the root article", () => {
    const ref = { current: null as HTMLElement | null };
    render(<AuditEntry ref={ref} {...BASE} data-testid="entry" />);
    expect(ref.current?.tagName).toBe("ARTICLE");
    expect(screen.getByTestId("entry")).toBe(ref.current);
  });

  it("has no a11y violations (default, with-detail, no-ip, no-ua)", async () => {
    const cases = [
      <AuditEntry key="d" {...BASE} ip="10.0.0.1" userAgent="Mozilla/5.0" />,
      <AuditEntry key="detail" {...BASE} detail="Note" />,
      <AuditEntry key="no-ip" {...BASE} userAgent="Mozilla/5.0" />,
      <AuditEntry key="no-ua" {...BASE} ip="10.0.0.1" />,
    ];
    for (const c of cases) {
      const { container, unmount } = render(c);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
