import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ActivityItem } from "./ActivityItem";

describe("ActivityItem", () => {
  it("renders actor and action", () => {
    render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="commented on"
        target="Project X"
        timestamp={new Date()}
      />,
    );
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("commented on")).toBeInTheDocument();
    expect(screen.getByText("Project X")).toBeInTheDocument();
  });

  it("toggles detail", async () => {
    const user = userEvent.setup();
    render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="did something"
        timestamp={new Date()}
        detail="More info"
      />,
    );
    expect(screen.queryByText("More info")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Show details/ }));
    expect(screen.getByText("More info")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ActivityItem
        actor={{ name: "Jane" }}
        action="did something"
        timestamp={new Date()}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
