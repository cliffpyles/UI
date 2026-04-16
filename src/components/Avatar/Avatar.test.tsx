import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders an img when src is provided", () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  // --- Fallback: Initials ---

  it("shows initials when src is absent but name is provided", () => {
    render(<Avatar alt="Jane Doe" name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows single initial for single-word name", () => {
    render(<Avatar alt="Madonna" name="Madonna" />);
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("shows initials from first and last name", () => {
    render(<Avatar alt="John Michael Smith" name="John Michael Smith" />);
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  // --- Fallback: Icon ---

  it("shows fallback icon when both src and name are absent", () => {
    const { container } = render(<Avatar alt="Unknown user" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  // --- Image error fallback ---

  it("falls back to initials on image load error", () => {
    render(
      <Avatar
        src="https://example.com/broken.jpg"
        alt="Jane"
        name="Jane Doe"
      />,
    );
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("falls back to icon on image error when name is absent", () => {
    const { container } = render(
      <Avatar src="https://example.com/broken.jpg" alt="Unknown" />,
    );
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  // --- Sizes ---

  it("applies sm size class", () => {
    const { container } = render(<Avatar alt="Test" size="sm" />);
    expect(container.firstChild).toHaveClass("ui-avatar--sm");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Avatar alt="Test" />);
    expect(container.firstChild).toHaveClass("ui-avatar--md");
  });

  it("applies lg size class", () => {
    const { container } = render(<Avatar alt="Test" size="lg" />);
    expect(container.firstChild).toHaveClass("ui-avatar--lg");
  });

  it("applies xl size class", () => {
    const { container } = render(<Avatar alt="Test" size="xl" />);
    expect(container.firstChild).toHaveClass("ui-avatar--xl");
  });

  // --- Shape ---

  it("applies circle shape by default", () => {
    const { container } = render(<Avatar alt="Test" />);
    expect(container.firstChild).toHaveClass("ui-avatar--circle");
  });

  it("applies square shape", () => {
    const { container } = render(<Avatar alt="Test" shape="square" />);
    expect(container.firstChild).toHaveClass("ui-avatar--square");
  });

  // --- Alt attribute ---

  it("has accessible label from alt", () => {
    render(<Avatar alt="Profile picture" />);
    expect(
      screen.getByRole("img", { name: "Profile picture" }),
    ).toBeInTheDocument();
  });

  // --- Ref forwarding ---

  it("forwards ref to the span element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} alt="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(<Avatar alt="Test" className="custom" />);
    expect(container.firstChild).toHaveClass("ui-avatar");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Prop spreading ---

  it("spreads additional props", () => {
    render(<Avatar alt="Test" data-testid="avatar" id="av-1" />);
    expect(screen.getByTestId("avatar")).toHaveAttribute("id", "av-1");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Avatar alt="Jane Doe" name="Jane Doe" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with image", async () => {
    const { container } = render(
      <Avatar src="https://example.com/photo.jpg" alt="Jane Doe" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
