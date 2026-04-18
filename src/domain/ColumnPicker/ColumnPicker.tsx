import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Menu } from "../../components/Menu";
import "./ColumnPicker.css";

export interface ColumnDescriptor {
  id: string;
  label: string;
  required?: boolean;
}

export interface ColumnPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: ColumnDescriptor[];
  visible: string[];
  onChange: (visible: string[]) => void;
  onReset?: () => void;
  reorderable?: boolean;
  triggerLabel?: string;
}

export const ColumnPicker = forwardRef<HTMLDivElement, ColumnPickerProps>(
  function ColumnPicker(
    {
      columns,
      visible,
      onChange,
      onReset,
      reorderable = true,
      triggerLabel = "Columns",
      className,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const keepOpenRef = useRef(false);
    const visibleSet = new Set(visible);
    const ariaLabel = `${triggerLabel}, ${visibleSet.size} of ${columns.length} visible`;

    const classes = ["ui-column-picker", className].filter(Boolean).join(" ");

    const handleOpenChange = (next: boolean) => {
      if (!next && keepOpenRef.current) {
        keepOpenRef.current = false;
        return;
      }
      setOpen(next);
    };

    const toggle = (id: string) => {
      keepOpenRef.current = true;
      if (visibleSet.has(id)) onChange(visible.filter((v) => v !== id));
      else onChange([...visible, id]);
    };

    const move = (id: string, delta: number) => {
      const order = [...visible];
      const i = order.indexOf(id);
      if (i < 0) return;
      const j = i + delta;
      if (j < 0 || j >= order.length) return;
      [order[i], order[j]] = [order[j], order[i]];
      keepOpenRef.current = true;
      onChange(order);
    };

    const handleItemKeyDown = (
      e: KeyboardEvent<HTMLDivElement>,
      id: string,
    ) => {
      if (!reorderable || !e.altKey) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        move(id, -1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        move(id, 1);
      }
    };

    return (
      <div ref={ref} className={classes} {...rest}>
        <Menu open={open} onOpenChange={handleOpenChange}>
          <Menu.Trigger asChild>
            <Button variant="ghost" size="sm" icon="eye" aria-label={ariaLabel}>
              {triggerLabel}
            </Button>
          </Menu.Trigger>
          <Menu.List aria-label="Select columns">
            <Box direction="column" gap="1">
              {columns.map((col) => (
                <Menu.Item
                  key={col.id}
                  onSelect={() => toggle(col.id)}
                  onKeyDown={(e) => handleItemKeyDown(e, col.id)}
                >
                  <Checkbox
                    checked={visibleSet.has(col.id)}
                    disabled={col.required}
                    label={col.label}
                    description={col.required ? "Required" : undefined}
                    tabIndex={-1}
                    onChange={() => {}}
                  />
                </Menu.Item>
              ))}
              {onReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    keepOpenRef.current = true;
                    onReset();
                  }}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Menu.List>
        </Menu>
      </div>
    );
  },
);
