import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Accordion } from "./Accordion";

function renderAccordion(props: {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (v: string | string[]) => void;
  collapsible?: boolean;
} = {}) {
  const { type, defaultValue = "item-1", value, onChange, collapsible } = props;
  return render(
    <Accordion
      type={type}
      defaultValue={value !== undefined ? undefined : defaultValue}
      value={value}
      onChange={onChange}
      collapsible={collapsible}
    >
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Section 1</Accordion.Trigger>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Section 2</Accordion.Trigger>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Section 3</Accordion.Trigger>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>
    </Accordion>,
  );
}

describe("Accordion", () => {
  // --- Single mode ---

  it("renders with default expanded item", () => {
    renderAccordion();
    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.getByText("Content 2")).not.toBeVisible();
  });

  it("only one item open at a time in single mode", async () => {
    renderAccordion();
    await userEvent.click(screen.getByRole("button", { name: "Section 2" }));
    expect(screen.getByText("Content 2")).toBeVisible();
    expect(screen.getByText("Content 1")).not.toBeVisible();
  });

  it("collapses open item when clicked again (collapsible)", async () => {
    renderAccordion();
    await userEvent.click(screen.getByRole("button", { name: "Section 1" }));
    expect(screen.getByText("Content 1")).not.toBeVisible();
  });

  it("does not collapse when collapsible is false", async () => {
    renderAccordion({ collapsible: false });
    await userEvent.click(screen.getByRole("button", { name: "Section 1" }));
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  // --- Multiple mode ---

  it("allows multiple items open in multiple mode", async () => {
    renderAccordion({ type: "multiple", defaultValue: ["item-1"] });
    await userEvent.click(screen.getByRole("button", { name: "Section 2" }));
    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.getByText("Content 2")).toBeVisible();
  });

  it("closes individual items in multiple mode", async () => {
    renderAccordion({ type: "multiple", defaultValue: ["item-1", "item-2"] });
    expect(screen.getByText("Content 1")).toBeVisible();
    expect(screen.getByText("Content 2")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Section 1" }));
    expect(screen.getByText("Content 1")).not.toBeVisible();
    expect(screen.getByText("Content 2")).toBeVisible();
  });

  // --- Controlled mode ---

  it("works in controlled mode", async () => {
    const onChange = vi.fn();
    renderAccordion({ value: "item-1", onChange });
    await userEvent.click(screen.getByRole("button", { name: "Section 2" }));
    expect(onChange).toHaveBeenCalledWith("item-2");
    // Still shows item-1 because controlled
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  // --- Keyboard navigation ---

  it("ArrowDown navigates to next trigger", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 1" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Section 2");
  });

  it("ArrowUp navigates to previous trigger", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 2" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Section 1");
  });

  it("ArrowDown wraps from last to first", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 3" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Section 1");
  });

  it("ArrowUp wraps from first to last", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 1" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Section 3");
  });

  it("Home key focuses first trigger", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 3" }).focus();
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Section 1");
  });

  it("End key focuses last trigger", async () => {
    renderAccordion();
    screen.getByRole("button", { name: "Section 1" }).focus();
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Section 3");
  });

  it("Enter toggles the focused item", async () => {
    renderAccordion({ defaultValue: "" });
    screen.getByRole("button", { name: "Section 1" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  it("Space toggles the focused item", async () => {
    renderAccordion({ defaultValue: "" });
    screen.getByRole("button", { name: "Section 1" }).focus();
    await userEvent.keyboard(" ");
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  // --- ARIA ---

  it("trigger has aria-expanded", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: "Section 1" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Section 2" })).toHaveAttribute("aria-expanded", "false");
  });

  it("trigger has aria-controls pointing to content", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: "Section 1" });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId!)).toBeInTheDocument();
  });

  it("content has role region and aria-labelledby", () => {
    renderAccordion();
    const regions = screen.getAllByRole("region");
    expect(regions.length).toBeGreaterThan(0);
    expect(regions[0]).toHaveAttribute("aria-labelledby");
  });

  // --- Ref forwarding ---

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Accordion ref={ref} defaultValue="">
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-accordion");
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(
      <Accordion className="custom" defaultValue="">
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(container.firstChild).toHaveClass("ui-accordion");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = renderAccordion();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with all items closed", async () => {
    const { container } = renderAccordion({ defaultValue: "" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
