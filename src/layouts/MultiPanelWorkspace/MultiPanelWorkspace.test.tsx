import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MultiPanelWorkspace, type WorkspacePanel } from "./MultiPanelWorkspace";

const panels: WorkspacePanel[] = [
  {
    id: "files",
    label: "Files",
    initialSize: 220,
    resizable: true,
    content: <div>file tree</div>,
  },
  {
    id: "editor",
    label: "Editor",
    content: <div>editor content</div>,
  },
];

describe("MultiPanelWorkspace", () => {
  it("renders all panels", () => {
    render(<MultiPanelWorkspace panels={panels} />);
    expect(screen.getByText("file tree")).toBeInTheDocument();
    expect(screen.getByText("editor content")).toBeInTheDocument();
  });

  it("labels panels via aria-label", () => {
    render(<MultiPanelWorkspace panels={panels} />);
    expect(screen.getByRole("region", { name: "Files" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Editor" })).toBeInTheDocument();
  });

  it("renders separator for resizable panels", () => {
    render(<MultiPanelWorkspace panels={panels} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("notifies on resize", async () => {
    const onSizeChange = vi.fn();
    render(<MultiPanelWorkspace panels={panels} onSizeChange={onSizeChange} />);
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onSizeChange).toHaveBeenCalled();
  });

  it("applies vertical direction class", () => {
    render(<MultiPanelWorkspace panels={panels} direction="vertical" data-testid="root" />);
    expect(screen.getByTestId("root")).toHaveClass("ui-multi-panel--vertical");
  });

  it("has no axe violations", async () => {
    const { container } = render(<MultiPanelWorkspace panels={panels} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
