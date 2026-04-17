import { describe, it, expect } from "vitest";
import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CardListLayout } from "./CardListLayout";

describe("CardListLayout", () => {
  it("renders items using renderCard", () => {
    render(
      <CardListLayout
        items={[{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }]}
        getKey={(i) => i.id}
        renderCard={(item) => <div>{item.name}</div>}
      />,
    );
    expect(screen.getByRole("region", { name: "Card list" })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows emptyState when items are empty", () => {
    render(
      <CardListLayout
        items={[]}
        renderCard={() => null}
        emptyState={<p>no items</p>}
      />,
    );
    expect(screen.getByText("no items")).toBeInTheDocument();
  });

  it("toggles view via prop", async () => {
    const user = userEvent.setup();
    function Host() {
      const [view, setView] = useState<"grid" | "list">("grid");
      return (
        <>
          <button onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}>
            toggle
          </button>
          <CardListLayout
            items={[{ id: "a" }]}
            getKey={(i) => i.id}
            renderCard={() => <div>card</div>}
            view={view}
          />
        </>
      );
    }
    const { container } = render(<Host />);
    expect(container.querySelector(".ui-card-list--grid")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(container.querySelector(".ui-card-list--list")).toBeTruthy();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CardListLayout
        ref={ref}
        className="extra"
        items={[1]}
        renderCard={(n) => <span>{n}</span>}
      />,
    );
    expect(ref.current?.className).toContain("ui-card-list");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <CardListLayout
        items={[{ id: "a", name: "Alpha" }]}
        getKey={(i) => i.id}
        renderCard={(item) => <div>{item.name}</div>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
