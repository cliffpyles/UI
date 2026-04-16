import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { VersionHistory } from "./VersionHistory";

const VERSIONS = [
  { id: "1", label: "v1.0", timestamp: new Date() },
  { id: "2", label: "v1.1", timestamp: new Date() },
];

describe("VersionHistory", () => {
  it("marks current", () => {
    render(<VersionHistory versions={VERSIONS} current="2" />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("restores old version", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<VersionHistory versions={VERSIONS} current="2" onRestore={fn} />);
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(fn).toHaveBeenCalledWith("1");
  });

  it("no a11y violations", async () => {
    const { container } = render(<VersionHistory versions={VERSIONS} current="1" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
