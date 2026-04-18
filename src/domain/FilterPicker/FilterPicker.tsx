import {
  forwardRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Popover } from "../../components/Popover";
import { Icon } from "../../primitives/Icon";
import type { FilterFieldType } from "../OperatorSelect";
import "./FilterPicker.css";

export interface FieldDef {
  id: string;
  label: string;
  type: FilterFieldType;
  group?: string;
}

export interface FilterPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  fields: FieldDef[];
  onSelect: (field: FieldDef) => void;
  triggerLabel?: string;
}

export const FilterPicker = forwardRef<HTMLDivElement, FilterPickerProps>(
  function FilterPicker(
    { fields, onSelect, triggerLabel = "Add filter", className, ...rest },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const classes = ["ui-filter-picker", className].filter(Boolean).join(" ");

    const filtered = query
      ? fields.filter((f) => f.label.toLowerCase().includes(query.toLowerCase()))
      : fields;

    const groups = new Map<string, FieldDef[]>();
    for (const f of filtered) {
      const g = f.group ?? "";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(f);
    }

    return (
      <Popover
        ref={ref}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        className={classes}
        {...rest}
      >
        <Popover.Trigger asChild>
          <Button variant="secondary" size="sm">
            <Icon name="plus" size="xs" aria-hidden /> {triggerLabel}
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="ui-filter-picker__panel"
          aria-label="Choose field"
        >
          <Input
            aria-label="Search fields"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fields…"
            size="sm"
          />
          <Box
            className="ui-filter-picker__list"
            display="flex"
            direction="column"
            role="listbox"
          >
            {Array.from(groups.entries()).map(([group, items]) => (
              <div key={group || "__ungrouped"} className="ui-filter-picker__group">
                {group && <div className="ui-filter-picker__group-label">{group}</div>}
                {items.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="option"
                    className="ui-filter-picker__option"
                    onClick={() => {
                      onSelect(f);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="ui-filter-picker__empty">No fields match</div>
            )}
          </Box>
        </Popover.Content>
      </Popover>
    );
  },
);
