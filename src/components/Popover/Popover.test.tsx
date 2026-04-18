import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef, useState } from "react";
import { Popover } from "./Popover";

function Basic({
  onOpenChange,
  defaultOpen,
}: {
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content aria-label="Info">
        <button type="button">Inside</button>
      </Popover.Content>
    </Popover>
  );
}

describe("Popover", () => {
  it("renders trigger and hides content by default", () => {
    render(<Basic />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens content on trigger click", async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    render(<Basic defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    render(
      <div>
        <Basic />
        <button type="button">Outside</button>
      </div>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled mode", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(v) => {
            onOpenChange(v);
            setOpen(v);
          }}
        >
          <Popover.Trigger>Toggle</Popover.Trigger>
          <Popover.Content aria-label="Panel">Content</Popover.Content>
        </Popover>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("trigger reflects aria-expanded state", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("supports asChild to clone the child as trigger", async () => {
    const onClick = vi.fn();
    render(
      <Popover>
        <Popover.Trigger asChild>
          <a href="#x" onClick={onClick}>
            Link
          </a>
        </Popover.Trigger>
        <Popover.Content aria-label="Info">Hello</Popover.Content>
      </Popover>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover ref={ref}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Info">x</Popover.Content>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-popover");
  });

  it("merges className on root", () => {
    const { container } = render(
      <Popover className="custom">
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Info">x</Popover.Content>
      </Popover>,
    );
    expect(container.firstChild).toHaveClass("ui-popover");
    expect(container.firstChild).toHaveClass("custom");
  });

  it("applies placement class to content", () => {
    render(
      <Popover defaultOpen placement="top-end">
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Info">x</Popover.Content>
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toHaveClass(
      "ui-popover__content--placement-top-end",
    );
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Popover defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Info">
          <button type="button">Action</button>
        </Popover.Content>
      </Popover>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
