import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { CurrencyInput } from "./CurrencyInput";

describe("CurrencyInput", () => {
  it("displays symbol", () => {
    render(<CurrencyInput value={10} onChange={() => {}} currency="USD" locale="en-US" />);
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("fires onChange with number", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CurrencyInput value={null} onChange={fn} aria-label="Amount" />);
    await user.type(screen.getByLabelText("Amount"), "5");
    expect(fn).toHaveBeenCalledWith(5);
  });

  it("null for empty", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CurrencyInput value={5} onChange={fn} aria-label="Amount" />);
    await user.clear(screen.getByLabelText("Amount"));
    expect(fn).toHaveBeenCalledWith(null);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<CurrencyInput ref={ref} value={1} onChange={() => {}} aria-label="x" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <CurrencyInput value={10} onChange={() => {}} aria-label="Amount" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
