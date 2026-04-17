import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  OnboardingChecklistLayout,
  type ChecklistTask,
} from "./OnboardingChecklistLayout";

const tasks: ChecklistTask[] = [
  { id: "1", title: "Create account", completed: true },
  { id: "2", title: "Invite team", description: "Add collaborators", completed: false, href: "/invite" },
  { id: "3", title: "Connect data", completed: false, action: <button>Start</button> },
];

describe("OnboardingChecklistLayout", () => {
  it("renders tasks and progress reflects completion", () => {
    render(<OnboardingChecklistLayout tasks={tasks} />);
    expect(
      screen.getByRole("region", { name: "Onboarding checklist" }),
    ).toBeInTheDocument();
    const progress = screen.getByRole("progressbar", {
      name: "Onboarding progress",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "33");
    expect(screen.getByText("1 of 3 complete")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Invite team" })).toHaveAttribute(
      "href",
      "/invite",
    );
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });

  it("updates progress as more tasks complete", () => {
    const more: ChecklistTask[] = [
      { id: "a", title: "A", completed: true },
      { id: "b", title: "B", completed: true },
    ];
    render(<OnboardingChecklistLayout tasks={more} />);
    const progress = screen.getByRole("progressbar", {
      name: "Onboarding progress",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("2 of 2 complete")).toBeInTheDocument();
  });

  it("fires onDismiss when dismiss button clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <OnboardingChecklistLayout
        tasks={tasks}
        dismissible
        onDismiss={onDismiss}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Dismiss checklist" }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <OnboardingChecklistLayout
        ref={ref}
        tasks={tasks}
        className="custom"
        data-testid="cl"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("cl")).toHaveClass(
      "ui-onboarding-checklist",
      "custom",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <OnboardingChecklistLayout tasks={tasks} dismissible />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
