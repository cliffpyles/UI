import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ChangeLog, type FieldChange } from "./ChangeLog";

describe("ChangeLog", () => {
  it("renders a 'changed' row with field + before + after", () => {
    render(
      <ChangeLog
        changes={[
          { field: "status", kind: "changed", before: "draft", after: "published" },
        ]}
      />,
    );
    expect(screen.getByText("status")).toBeInTheDocument();
    expect(screen.getByText("draft")).toBeInTheDocument();
    expect(screen.getByText("published")).toBeInTheDocument();
    expect(screen.getByText("changed from")).toBeInTheDocument();
  });

  it("renders an 'added' row only showing the new value with success color", () => {
    const { container } = render(
      <ChangeLog changes={[{ field: "x", kind: "added", after: "hello" }]} />,
    );
    expect(screen.getByText("added")).toBeInTheDocument();
    expect(container.querySelector(".ui-text--success")).not.toBeNull();
  });

  it("renders a 'removed' row with error color", () => {
    const { container } = render(
      <ChangeLog changes={[{ field: "x", kind: "removed", before: "gone" }]} />,
    );
    expect(screen.getByText("removed")).toBeInTheDocument();
    expect(container.querySelector(".ui-text--error")).not.toBeNull();
  });

  it("renders em-dash for null values", () => {
    render(<ChangeLog changes={[{ field: "x", kind: "changed", before: null, after: "y" }]} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders the empty label when there are no changes", () => {
    render(<ChangeLog changes={[]} />);
    expect(screen.getByText("No changes")).toBeInTheDocument();
  });

  it("groupBy produces grouped output separated by Dividers", () => {
    const changes: FieldChange[] = [
      { field: "name", kind: "changed", before: "A", after: "B" },
      { field: "owner", kind: "changed", before: "X", after: "Y" },
    ];
    const { container } = render(
      <ChangeLog
        changes={changes}
        groupBy={(c) => (c.field === "name" ? "Profile" : "Access")}
      />,
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Access")).toBeInTheDocument();
    expect(container.querySelectorAll(".ui-divider").length).toBeGreaterThanOrEqual(1);
  });

  it("forwards ref and renders as <section>", () => {
    const ref = { current: null as HTMLElement | null };
    render(<ChangeLog ref={ref} changes={[]} />);
    expect(ref.current?.tagName).toBe("SECTION");
  });

  it("has no a11y violations across kinds", async () => {
    const cases = [
      <ChangeLog key="empty" changes={[]} />,
      <ChangeLog
        key="added"
        changes={[{ field: "x", kind: "added", after: "y" }]}
      />,
      <ChangeLog
        key="removed"
        changes={[{ field: "x", kind: "removed", before: "y" }]}
      />,
      <ChangeLog
        key="changed"
        changes={[{ field: "x", kind: "changed", before: "a", after: "b" }]}
      />,
    ];
    for (const c of cases) {
      const { container, unmount } = render(c);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
