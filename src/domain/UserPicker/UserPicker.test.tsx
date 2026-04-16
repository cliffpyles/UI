import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { UserPicker } from "./UserPicker";
import type { UserData } from "../UserAvatar";

const USERS: UserData[] = [
  { id: "a", name: "Alice" },
  { id: "b", name: "Bob" },
  { id: "c", name: "Carol" },
];

function Controlled(props: Partial<React.ComponentProps<typeof UserPicker>>) {
  const [value, setValue] = useState<UserData[]>([]);
  return <UserPicker value={value} onChange={setValue} users={USERS} {...props} />;
}

describe("UserPicker", () => {
  it("shows options when focused", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: /Alice/ })).toBeInTheDocument();
  });

  it("filters by query", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "bo");
    expect(screen.getByRole("option", { name: /Bob/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Alice/ })).not.toBeInTheDocument();
  });

  it("selects and shows chip", async () => {
    const user = userEvent.setup();
    render(<Controlled multiple={false} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Alice/ }));
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("calls onSearch", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<Controlled onSearch={onSearch} />);
    await user.click(screen.getByRole("combobox"));
    await user.type(screen.getByRole("combobox"), "x");
    expect(onSearch).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<Controlled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
