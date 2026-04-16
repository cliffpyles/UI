import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Input } from "../../components/Input";
import { Tag } from "../../components/Tag";
import { Icon } from "../../primitives/Icon";
import "./LabelPicker.css";

export interface LabelDef {
  id: string;
  name: string;
  color?: string;
}

export interface LabelPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[];
  onChange: (ids: string[]) => void;
  labels: LabelDef[];
  allowCreate?: boolean;
  onCreate?: (name: string) => void;
  placeholder?: string;
}

export const LabelPicker = forwardRef<HTMLDivElement, LabelPickerProps>(
  function LabelPicker(
    {
      value,
      onChange,
      labels,
      allowCreate,
      onCreate,
      placeholder = "Search labels…",
      className,
      ...rest
    },
    ref,
  ) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const classes = ["ui-label-picker", className].filter(Boolean).join(" ");
    const valueSet = new Set(value);

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const filtered = query
      ? labels.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
      : labels;

    const toggle = (id: string) => {
      if (valueSet.has(id)) onChange(value.filter((v) => v !== id));
      else onChange([...value, id]);
    };

    const byId = new Map(labels.map((l) => [l.id, l]));

    const canCreate =
      allowCreate &&
      query.trim() &&
      !labels.some((l) => l.name.toLowerCase() === query.trim().toLowerCase());

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
        <div className="ui-label-picker__selected">
          {value.map((id) => {
            const l = byId.get(id);
            if (!l) return null;
            return (
              <Tag
                key={id}
                removable
                onRemove={() => toggle(id)}
                style={l.color ? { backgroundColor: l.color, borderColor: l.color, color: "white" } : undefined}
              >
                {l.name}
              </Tag>
            );
          })}
        </div>
        <Input
          aria-label="Search labels"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          size="sm"
        />
        {open && (
          <ul className="ui-label-picker__list" role="listbox">
            {filtered.map((l) => (
              <li
                key={l.id}
                role="option"
                aria-selected={valueSet.has(l.id)}
                className={
                  "ui-label-picker__option" +
                  (valueSet.has(l.id) ? " ui-label-picker__option--selected" : "")
                }
                onClick={() => toggle(l.id)}
              >
                {l.color && (
                  <span
                    className="ui-label-picker__swatch"
                    style={{ background: l.color }}
                    aria-hidden
                  />
                )}
                <span>{l.name}</span>
              </li>
            ))}
            {canCreate && onCreate && (
              <li
                role="option"
                aria-selected={false}
                className="ui-label-picker__option ui-label-picker__option--create"
                onClick={() => {
                  onCreate(query.trim());
                  setQuery("");
                }}
              >
                <Icon name="plus" size="xs" aria-hidden /> Create “{query.trim()}”
              </li>
            )}
            {filtered.length === 0 && !canCreate && (
              <li className="ui-label-picker__empty">No labels match</li>
            )}
          </ul>
        )}
      </div>
    );
  },
);
