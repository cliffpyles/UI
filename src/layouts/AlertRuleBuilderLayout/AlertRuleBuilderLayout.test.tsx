import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AlertRuleBuilderLayout } from "./AlertRuleBuilderLayout";

describe("AlertRuleBuilderLayout", () => {
  it("renders required conditions section", () => {
    render(
      <AlertRuleBuilderLayout conditions={<div>cpu &gt; 90</div>} />,
    );
    expect(
      screen.getByRole("region", { name: "Conditions" }),
    ).toHaveTextContent("cpu > 90");
  });

  it("renders optional slots", () => {
    render(
      <AlertRuleBuilderLayout
        conditions={<div>c</div>}
        channels={<div>slack</div>}
        preview={<div>preview</div>}
        test={<div>test area</div>}
        footer={<button>Save</button>}
      />,
    );
    expect(screen.getByRole("region", { name: "Channels" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Test" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("supports interaction in footer", async () => {
    const onSave = vi.fn();
    render(
      <AlertRuleBuilderLayout
        conditions={<div>c</div>}
        footer={<button onClick={onSave}>Save</button>}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <AlertRuleBuilderLayout
        conditions={<div>c</div>}
        ref={ref}
        className="custom"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-alert-rule-builder", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AlertRuleBuilderLayout conditions={<div>c</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
