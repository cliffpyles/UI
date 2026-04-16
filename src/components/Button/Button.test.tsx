import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Button variant="secondary">Btn</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--secondary");
  });

  it("applies size class", () => {
    render(<Button size="lg">Btn</Button>);
    expect(screen.getByRole("button")).toHaveClass("ui-button--lg");
  });

  it("calls onClick handler", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Btn</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Btn</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
