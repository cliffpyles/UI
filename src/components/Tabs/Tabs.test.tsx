import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Tabs } from "./Tabs";

function renderTabs(props: {
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  disabledTab?: boolean;
} = {}) {
  const { value, defaultValue = "overview", onChange, disabledTab = false } = props;
  return render(
    <Tabs value={value} defaultValue={value !== undefined ? undefined : defaultValue} onChange={onChange}>
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="details">Details</Tabs.Tab>
        <Tabs.Tab value="history" disabled={disabledTab}>History</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="details">Details content</Tabs.Panel>
      <Tabs.Panel value="history">History content</Tabs.Panel>
    </Tabs>,
  );
}

describe("Tabs", () => {
  // --- Basic rendering ---

  it("renders the active panel", () => {
    renderTabs();
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Details content")).not.toBeInTheDocument();
  });

  it("renders all tabs in the tab list", () => {
    renderTabs();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  // --- Switching tabs ---

  it("switches panel on tab click", async () => {
    renderTabs();
    await userEvent.click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByText("Details content")).toBeInTheDocument();
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  // --- Controlled mode ---

  it("works in controlled mode", async () => {
    const onChange = vi.fn();
    renderTabs({ value: "overview", onChange });
    await userEvent.click(screen.getByRole("tab", { name: "Details" }));
    expect(onChange).toHaveBeenCalledWith("details");
    // Panel doesn't change because controlled — still shows overview
    expect(screen.getByText("Overview content")).toBeInTheDocument();
  });

  // --- Uncontrolled mode ---

  it("works in uncontrolled mode with defaultValue", () => {
    renderTabs({ defaultValue: "details" });
    expect(screen.getByText("Details content")).toBeInTheDocument();
  });

  // --- Disabled tabs ---

  it("disabled tabs cannot be clicked", async () => {
    const onChange = vi.fn();
    renderTabs({ disabledTab: true, onChange });
    await userEvent.click(screen.getByRole("tab", { name: "History" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disabled tabs are skipped during keyboard navigation", async () => {
    renderTabs({ disabledTab: true });
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();
    // ArrowRight from Overview -> Details (skips disabled History)
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("Details");
    // ArrowRight from Details -> wraps to Overview (skips disabled History)
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("Overview");
  });

  // --- Keyboard navigation ---

  it("ArrowRight moves to next tab", async () => {
    renderTabs();
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("Details");
  });

  it("ArrowLeft moves to previous tab", async () => {
    renderTabs();
    const detailsTab = screen.getByRole("tab", { name: "Details" });
    detailsTab.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toHaveTextContent("Overview");
  });

  it("ArrowRight wraps from last to first", async () => {
    renderTabs();
    const historyTab = screen.getByRole("tab", { name: "History" });
    historyTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("Overview");
  });

  it("ArrowLeft wraps from first to last", async () => {
    renderTabs();
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toHaveTextContent("History");
  });

  it("Home key moves to first tab", async () => {
    renderTabs();
    const historyTab = screen.getByRole("tab", { name: "History" });
    historyTab.focus();
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Overview");
  });

  it("End key moves to last tab", async () => {
    renderTabs();
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("History");
  });

  // --- ARIA attributes ---

  it("active tab has aria-selected true", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute("aria-selected", "false");
  });

  it("tablist has correct role", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("tab has aria-controls pointing to panel", () => {
    renderTabs();
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panelId = tab.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", panelId);
  });

  it("panel has aria-labelledby pointing to tab", () => {
    renderTabs();
    const panel = screen.getByRole("tabpanel");
    const tabId = panel.getAttribute("aria-labelledby");
    expect(tabId).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("id", tabId);
  });

  it("only active tab has tabIndex 0", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute("tabindex", "-1");
  });

  // --- Ref forwarding ---

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs ref={ref} defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
      </Tabs>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-tabs");
  });

  // --- className merging ---

  it("merges custom className on root", () => {
    const { container } = render(
      <Tabs className="custom" defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
      </Tabs>,
    );
    expect(container.firstChild).toHaveClass("ui-tabs");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = renderTabs();
    expect(await axe(container)).toHaveNoViolations();
  });
});
