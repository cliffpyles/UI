import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ScheduledDeliveryLayout } from "./ScheduledDeliveryLayout";

describe("ScheduledDeliveryLayout", () => {
  it("renders required and optional sections", () => {
    render(
      <ScheduledDeliveryLayout
        frequency={<div>Daily</div>}
        recipients={<div>team@example.com</div>}
        format={<div>PDF</div>}
        window={<div>9am</div>}
        footer={<button type="button">Save</button>}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Scheduled delivery" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Delivery frequency" }),
    ).toHaveTextContent("Daily");
    expect(
      screen.getByRole("region", { name: "Recipients" }),
    ).toHaveTextContent("team@example.com");
    expect(
      screen.getByRole("region", { name: "Delivery format" }),
    ).toHaveTextContent("PDF");
    expect(
      screen.getByRole("region", { name: "Delivery window" }),
    ).toHaveTextContent("9am");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("omits optional sections when not provided", () => {
    render(
      <ScheduledDeliveryLayout
        frequency={<div>f</div>}
        recipients={<div>r</div>}
      />,
    );
    expect(
      screen.queryByRole("region", { name: "Delivery format" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Delivery window" }),
    ).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ScheduledDeliveryLayout
        ref={ref}
        className="custom"
        frequency={<div />}
        recipients={<div />}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass(
      "ui-scheduled-delivery",
      "custom",
    );
  });

  it("invokes footer action on click", async () => {
    const onSave = vi.fn();
    render(
      <ScheduledDeliveryLayout
        frequency={<div />}
        recipients={<div />}
        footer={
          <button type="button" onClick={onSave}>
            Save
          </button>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ScheduledDeliveryLayout
        frequency={<label>Freq <select><option>Daily</option></select></label>}
        recipients={<label>To <input defaultValue="a@b" /></label>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
