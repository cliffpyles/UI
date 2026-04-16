import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
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
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const classes = ["ui-column-picker", className].filter(Boolean).join(" ");
    const visibleSet = new Set(visible);

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const toggle = (id: string) => {
      if (visibleSet.has(id)) onChange(visible.filter((v) => v !== id));
      else onChange([...visible, id]);
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={classes}
        {...rest}
      >
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          <Icon name="eye" size="xs" aria-hidden /> {triggerLabel}
        </Button>
        {open && (
          <div className="ui-column-picker__panel" role="dialog" aria-label="Select columns">
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
          </div>
        )}
      </div>
    );
  },
);
