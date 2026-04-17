import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { HierarchicalTreeLayout, type TreeNode } from "./HierarchicalTreeLayout";

const nodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "App.tsx" },
      {
        id: "components",
        label: "components",
        children: [{ id: "Button", label: "Button.tsx" }],
      },
    ],
  },
  { id: "readme", label: "README.md" },
];

describe("HierarchicalTreeLayout", () => {
  it("renders tree with expanded root", () => {
    render(
      <HierarchicalTreeLayout nodes={nodes} defaultExpandedIds={["src"]}>
        <div>content</div>
      </HierarchicalTreeLayout>,
    );
    expect(screen.getByRole("tree", { name: /hierarchy/i })).toBeInTheDocument();
    expect(screen.getByText("App.tsx")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("marks selection with aria-selected", () => {
    render(
      <HierarchicalTreeLayout nodes={nodes} selectedId="readme">
        <div />
      </HierarchicalTreeLayout>,
    );
    expect(screen.getByRole("treeitem", { name: /README.md/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("calls onSelect on click", async () => {
    const onSelect = vi.fn();
    render(
      <HierarchicalTreeLayout
        nodes={nodes}
        defaultExpandedIds={["src"]}
        onSelect={onSelect}
      >
        <div />
      </HierarchicalTreeLayout>,
    );
    await userEvent.click(screen.getByText("App.tsx"));
    expect(onSelect).toHaveBeenCalledWith("app");
  });

  it("expands node when expand button clicked", async () => {
    const onToggle = vi.fn();
    render(
      <HierarchicalTreeLayout nodes={nodes} onToggle={onToggle}>
        <div />
      </HierarchicalTreeLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: /expand src/i }));
    expect(onToggle).toHaveBeenCalledWith("src", true);
    expect(screen.getByText("App.tsx")).toBeInTheDocument();
  });

  it("navigates with ArrowDown", async () => {
    const onSelect = vi.fn();
    render(
      <HierarchicalTreeLayout
        nodes={nodes}
        selectedId="src"
        onSelect={onSelect}
      >
        <div />
      </HierarchicalTreeLayout>,
    );
    screen.getByRole("treeitem", { name: /^src$/ }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(onSelect).toHaveBeenCalledWith("readme");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <HierarchicalTreeLayout nodes={nodes} defaultExpandedIds={["src"]}>
        <div />
      </HierarchicalTreeLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
