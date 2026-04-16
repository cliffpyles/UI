import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { GeolocationInput } from "./GeolocationInput";

describe("GeolocationInput", () => {
  it("renders inputs", () => {
    render(<GeolocationInput value={null} onChange={() => {}} />);
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Longitude")).toBeInTheDocument();
  });

  it("fires onChange for address", () => {
    const fn = vi.fn();
    render(<GeolocationInput value={null} onChange={fn} />);
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "1 Main St" },
    });
    expect(fn).toHaveBeenCalledWith({ lat: 0, lng: 0, address: "1 Main St" });
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <GeolocationInput value={{ lat: 1, lng: 2 }} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
