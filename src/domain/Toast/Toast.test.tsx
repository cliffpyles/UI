import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Toast } from "./Toast";
import { ToastProvider } from "./ToastProvider";
import { useToast } from "./toast-context";

describe("Toast", () => {
  it("renders title and description", () => {
    render(<Toast title="Saved" description="All good" />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("alerts on error", () => {
    render(<Toast variant="error" title="Oops" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("fires onDismiss", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<Toast title="x" onDismiss={fn} />);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<Toast title="ok" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ToastProvider + useToast", () => {
  function Trigger({ duration = 50 }: { duration?: number }) {
    const { toast } = useToast();
    return (
      <button onClick={() => toast({ title: "Hi there", duration })}>fire</button>
    );
  }

  it("shows toast", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger duration={0} />
      </ToastProvider>,
    );
    await user.click(screen.getByText("fire"));
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("auto-dismisses after duration", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger duration={50} />
      </ToastProvider>,
    );
    await user.click(screen.getByText("fire"));
    await new Promise((r) => setTimeout(r, 150));
    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
  });

  it("throws useToast outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow();
    spy.mockRestore();
  });
});
