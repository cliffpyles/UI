import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { IncidentDetailLayout } from "./IncidentDetailLayout";

describe("IncidentDetailLayout", () => {
  it("renders header and timeline", () => {
    render(
      <IncidentDetailLayout
        header={<h1>INC-42 Critical</h1>}
        timeline={<ol><li>Event 1</li></ol>}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "INC-42 Critical" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Timeline" }),
    ).toHaveTextContent("Event 1");
  });

  it("renders optional slots", () => {
    render(
      <IncidentDetailLayout
        header={<div>h</div>}
        timeline={<div>t</div>}
        signals={<div>sig</div>}
        responders={<div>resp</div>}
        actions={<button>Resolve</button>}
      />,
    );
    expect(screen.getByRole("region", { name: "Signals" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Responders" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Actions" })).toBeInTheDocument();
  });

  it("supports interaction in actions slot", async () => {
    const onClick = vi.fn();
    render(
      <IncidentDetailLayout
        header={<div>h</div>}
        timeline={<div>t</div>}
        actions={<button onClick={onClick}>Resolve</button>}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Resolve" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <IncidentDetailLayout
        header={<div>h</div>}
        timeline={<div>t</div>}
        ref={ref}
        className="custom"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-incident-detail", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <IncidentDetailLayout
        header={<h1>Inc</h1>}
        timeline={<ol><li>e</li></ol>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
