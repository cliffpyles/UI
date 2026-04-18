import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Popover } from "../../components/Popover";
import { Icon } from "../../primitives/Icon";
import "./ColumnPicker.css";

export interface ColumnDef {
  id: string;
  label: string;
  required?: boolean;
}

export interface ColumnPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: ColumnDef[];
  visible: string[];
  onChange: (visible: string[]) => void;
  triggerLabel?: string;
}

export const ColumnPicker = forwardRef<HTMLDivElement, ColumnPickerProps>(
  function ColumnPicker(
    { columns, visible, onChange, triggerLabel = "Columns", className, ...rest },
    ref,
  ) {
    const classes = ["ui-column-picker", className].filter(Boolean).join(" ");
    const visibleSet = new Set(visible);

    const toggle = (id: string) => {
      if (visibleSet.has(id)) onChange(visible.filter((v) => v !== id));
      else onChange([...visible, id]);
    };

    return (
      <Popover ref={ref} className={classes} {...rest}>
        <Popover.Trigger asChild>
          <Button variant="secondary" size="sm">
            <Icon name="eye" size="xs" aria-hidden /> {triggerLabel}
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="ui-column-picker__panel"
          aria-label="Select columns"
        >
          {columns.map((col) => (
            <label key={col.id} className="ui-column-picker__item">
              <Checkbox
                checked={visibleSet.has(col.id)}
                disabled={col.required}
                onChange={() => toggle(col.id)}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </Popover.Content>
      </Popover>
    );
  },
);
