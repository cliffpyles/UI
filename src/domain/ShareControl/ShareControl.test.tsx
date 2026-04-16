import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ShareControl } from "./ShareControl";

describe("ShareControl", () => {
  it("fires onShare", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<ShareControl currentAccess="private" onShare={fn} />);
    await user.click(screen.getByRole("button", { name: /Share/ }));
    expect(fn).toHaveBeenCalled();
  });

  it("renders visibility", () => {
    render(<ShareControl currentAccess="public" onShare={() => {}} />);
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ShareControl currentAccess="team" onShare={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
