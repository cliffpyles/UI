import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children as button text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders as a button element by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  // --- Variants ---

  it("applies primary variant class by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--primary");
  });

  it("applies secondary variant class", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--secondary");
  });

  it("applies ghost variant class", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--ghost");
  });

  it("applies destructive variant class", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--destructive");
  });

  // --- Sizes ---

  it("defaults to md size", () => {
    render(<Button>Md</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--md");
  });

  it("applies sm size class", () => {
    render(<Button size="sm">Sm</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--sm");
  });

  it("applies lg size class", () => {
    render(<Button size="lg">Lg</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--lg");
  });

  // --- Interaction ---

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // --- Keyboard ---

  it("activates on Enter key", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enter</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("activates on Space key", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Space</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // --- Loading ---

  it("shows spinner when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("disables the button when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call onClick when loading", async () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies loading class", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--loading");
  });

  // --- Polymorphic as="a" ---

  it("renders as anchor when as='a'", () => {
    render(
      <Button as="a" href="/dashboard">
        Dashboard
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("sets aria-disabled on anchor when loading", () => {
    render(
      <Button as="a" href="/test" loading>
        Link
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
  });

  // --- Disabled ---

  it("disables the button when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // --- Ref forwarding ---

  it("forwards ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards ref to the anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button as="a" href="#" ref={ref}>
        Link
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  // --- Prop spreading ---

  it("spreads additional props", () => {
    render(<Button data-testid="btn" id="btn-1">Spread</Button>);
    expect(screen.getByTestId("btn")).toHaveAttribute("id", "btn-1");
  });

  // --- className merging ---

  it("merges custom className", () => {
    render(<Button className="custom">Cls</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("ui-button");
    expect(btn).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations as anchor", async () => {
    const { container } = render(
      <Button as="a" href="/test">
        Link
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
