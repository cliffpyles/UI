import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { CurrencyInput } from "./CurrencyInput";

describe("CurrencyInput", () => {
  it("displays leading symbol", () => {
    render(
      <CurrencyInput
        value={{ amount: 10, currency: "USD" }}
        onChange={() => {}}
        locale="en-US"
      />,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("emits MoneyValue when amount changes", () => {
    const fn = vi.fn();
    render(
      <CurrencyInput value={{ amount: null, currency: "USD" }} onChange={fn} />,
    );
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "42" } });
    expect(fn).toHaveBeenCalledWith({ amount: 42, currency: "USD" });
  });

  it("emits null amount when cleared", () => {
    const fn = vi.fn();
    render(
      <CurrencyInput value={{ amount: 5, currency: "USD" }} onChange={fn} />,
    );
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "" } });
    expect(fn).toHaveBeenCalledWith({ amount: null, currency: "USD" });
  });

  it("changes currency via Select", () => {
    const fn = vi.fn();
    render(
      <CurrencyInput
        value={{ amount: 10, currency: "USD" }}
        onChange={fn}
        currencies={["USD", "EUR", "JPY"]}
      />,
    );
    fireEvent.change(screen.getByLabelText("Currency"), { target: { value: "EUR" } });
    expect(fn).toHaveBeenCalledWith({ amount: 10, currency: "EUR" });
  });

  it("updates leading symbol when currency prop changes", () => {
    const { rerender } = render(
      <CurrencyInput
        value={{ amount: 10, currency: "USD" }}
        onChange={() => {}}
        locale="en-US"
        currencies={["USD", "EUR"]}
      />,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    rerender(
      <CurrencyInput
        value={{ amount: 10, currency: "EUR" }}
        onChange={() => {}}
        locale="en-US"
        currencies={["USD", "EUR"]}
      />,
    );
    expect(screen.getByText("€")).toBeInTheDocument();
  });

  it("sets aria-invalid on error", () => {
    render(
      <CurrencyInput
        value={{ amount: 10, currency: "USD" }}
        onChange={() => {}}
        error
      />,
    );
    expect(screen.getByLabelText("Amount")).toHaveAttribute("aria-invalid", "true");
  });

  it("disables both controls", () => {
    render(
      <CurrencyInput
        value={{ amount: 10, currency: "USD" }}
        onChange={() => {}}
        disabled
      />,
    );
    expect(screen.getByLabelText("Amount")).toBeDisabled();
    expect(screen.getByLabelText("Currency")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CurrencyInput
        ref={ref}
        value={{ amount: 1, currency: "USD" }}
        onChange={() => {}}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <CurrencyInput value={{ amount: 10, currency: "USD" }} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
