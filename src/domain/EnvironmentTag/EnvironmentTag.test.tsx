import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EnvironmentTag, type Environment } from "./EnvironmentTag";

const ENVS: Environment[] = [
  "production",
  "staging",
  "development",
  "preview",
  "local",
];

describe("EnvironmentTag", () => {
  it.each(ENVS)("renders default label for %s", (env) => {
    render(<EnvironmentTag environment={env} />);
    expect(screen.getByText(env.toUpperCase())).toBeInTheDocument();
  });

  it("`label` overrides default copy", () => {
    render(<EnvironmentTag environment="production" label="PROD" />);
    expect(screen.getByText("PROD")).toBeInTheDocument();
  });

  it("aria-label includes the environment name", () => {
    render(
      <EnvironmentTag environment="staging" data-testid="t" />,
    );
    expect(screen.getByTestId("t")).toHaveAttribute(
      "aria-label",
      "Environment: STAGING",
    );
  });

  it("composes Badge", () => {
    const { container } = render(
      <EnvironmentTag environment="production" />,
    );
    expect(container.querySelector(".ui-badge")).not.toBeNull();
  });

  it("forwards ref and spreads remaining props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <EnvironmentTag
        ref={ref}
        environment="production"
        className="x"
        data-testid="t"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("t")).toHaveClass("ui-environment-tag", "x");
  });

  it.each(ENVS)("axe passes for %s", async (env) => {
    const { container } = render(<EnvironmentTag environment={env} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
