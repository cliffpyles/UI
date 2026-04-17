import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TabPersistenceLayout, type PersistentTab } from "./TabPersistenceLayout";

const tabs: PersistentTab[] = [
  { id: "a", title: "Alpha", content: <p>alpha body</p> },
  { id: "b", title: "Beta", content: <p>beta body</p>, unsaved: true },
  { id: "c", title: "Gamma", content: <p>gamma body</p>, closable: false },
];

describe("TabPersistenceLayout", () => {
  it("renders tablist with tabs", () => {
    render(<TabPersistenceLayout tabs={tabs} activeId="a" onActivate={() => {}} />);
    expect(screen.getByRole("tablist", { name: /open tabs/i })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("marks active tab as selected", () => {
    render(<TabPersistenceLayout tabs={tabs} activeId="b" onActivate={() => {}} />);
    expect(screen.getByRole("tab", { name: /Beta/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders active tab content in tabpanel", () => {
    render(<TabPersistenceLayout tabs={tabs} activeId="a" onActivate={() => {}} />);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("alpha body");
  });

  it("activates tab on click", async () => {
    const onActivate = vi.fn();
    render(<TabPersistenceLayout tabs={tabs} activeId="a" onActivate={onActivate} />);
    await userEvent.click(screen.getByRole("tab", { name: /Beta/ }));
    expect(onActivate).toHaveBeenCalledWith("b");
  });

  it("moves active tab with ArrowRight", async () => {
    const onActivate = vi.fn();
    render(<TabPersistenceLayout tabs={tabs} activeId="a" onActivate={onActivate} />);
    screen.getByRole("tab", { name: /Alpha/ }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onActivate).toHaveBeenCalledWith("b");
  });

  it("calls onClose when close clicked", async () => {
    const onClose = vi.fn();
    render(
      <TabPersistenceLayout tabs={tabs} activeId="a" onActivate={() => {}} onClose={onClose} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /close alpha/i }));
    expect(onClose).toHaveBeenCalledWith("a");
  });

  it("does not show close for non-closable tabs", () => {
    render(
      <TabPersistenceLayout
        tabs={tabs}
        activeId="a"
        onActivate={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.queryByRole("button", { name: /close gamma/i })).not.toBeInTheDocument();
  });

  it("renders add tab button", async () => {
    const onAdd = vi.fn();
    render(
      <TabPersistenceLayout
        tabs={tabs}
        activeId="a"
        onActivate={() => {}}
        onAddTab={onAdd}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /new tab/i }));
    expect(onAdd).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TabPersistenceLayout tabs={tabs} activeId="a" onActivate={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
