import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import { axe } from "vitest-axe";
import { BillingUsageLayout } from "./BillingUsageLayout";

const usage = [
  { id: "seats", label: "Seats", current: 5, limit: 10 },
  { id: "storage", label: "Storage", current: 12, limit: 10, unit: "GB" },
];

describe("BillingUsageLayout", () => {
  it("renders plan and usage meters", () => {
    render(
      <BillingUsageLayout
        plan={<div>Pro Plan</div>}
        usage={usage}
      />,
    );
    expect(screen.getByRole("region", { name: "Billing and usage" })).toBeInTheDocument();
    expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    const meters = screen.getAllByRole("progressbar");
    expect(meters).toHaveLength(2);
    expect(meters[0]).toHaveAttribute("aria-valuenow", "5");
    expect(meters[0]).toHaveAttribute("aria-valuemax", "10");
  });

  it("renders invoices and upgrade slots", () => {
    render(
      <BillingUsageLayout
        plan={<div>p</div>}
        usage={usage}
        invoices={<table aria-label="invoices"><tbody><tr><td>inv</td></tr></tbody></table>}
        upgrade={<button>Upgrade</button>}
      />,
    );
    expect(screen.getByRole("group", { name: "Invoices" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
  });

  it("indicates over-limit usage", () => {
    render(<BillingUsageLayout plan={<div>p</div>} usage={usage} />);
    const bars = document.querySelectorAll(".ui-billing-usage__bar");
    expect(bars[1].classList.contains("ui-billing-usage__bar--over")).toBe(true);
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BillingUsageLayout
        ref={ref}
        className="custom"
        plan={<div>p</div>}
        usage={usage}
      />,
    );
    expect(ref.current?.className).toContain("ui-billing-usage");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BillingUsageLayout
        plan={<div>Pro</div>}
        usage={usage}
        invoices={<div>no invoices</div>}
        upgrade={<button>Upgrade</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
