import { forwardRef, useState, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import { Checkbox } from "../../components/Checkbox";
import "./CategoryPicker.css";

export interface CategoryNode {
  id: string;
  label: string;
  children?: CategoryNode[];
}

export interface CategoryPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  categories: CategoryNode[];
  value: string[] | string | null;
  onChange: (value: string[] | string | null) => void;
  multiple?: boolean;
  defaultExpanded?: boolean;
}

interface NodeRowProps {
  node: CategoryNode;
  selected: Set<string>;
  multiple: boolean;
  depth: number;
  onToggle: (id: string) => void;
  defaultExpanded: boolean;
}

function NodeRow({
  node,
  selected,
  multiple,
  depth,
  onToggle,
  defaultExpanded,
}: NodeRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = !!node.children?.length;
  const isSelected = selected.has(node.id);

  return (
    <li className="ui-category-picker__item" style={{ paddingLeft: `${depth * 16}px` }}>
      <div className="ui-category-picker__row">
        {hasChildren ? (
          <button
            type="button"
            className="ui-category-picker__chevron"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <Icon name={expanded ? "chevron-down" : "chevron-right"} size="xs" aria-hidden />
          </button>
        ) : (
          <span className="ui-category-picker__spacer" aria-hidden="true" />
        )}
        <label className="ui-category-picker__label">
          {multiple ? (
            <Checkbox checked={isSelected} onChange={() => onToggle(node.id)} />
          ) : (
            <input
              type="radio"
              checked={isSelected}
              onChange={() => onToggle(node.id)}
            />
          )}
          <span>{node.label}</span>
        </label>
      </div>
      {hasChildren && expanded && (
        <ul className="ui-category-picker__children">
          {node.children!.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              selected={selected}
              multiple={multiple}
              depth={depth + 1}
              onToggle={onToggle}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export const CategoryPicker = forwardRef<HTMLDivElement, CategoryPickerProps>(
  function CategoryPicker(
    {
      categories,
      value,
      onChange,
      multiple = false,
      defaultExpanded = false,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-category-picker", className].filter(Boolean).join(" ");

    const selected = new Set(
      Array.isArray(value) ? value : value ? [value] : [],
    );

    const toggle = (id: string) => {
      if (multiple) {
        const arr = Array.isArray(value) ? value : [];
        const set = new Set(arr);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        onChange(Array.from(set));
      } else {
        onChange(selected.has(id) ? null : id);
      }
    };

    return (
      <div ref={ref} className={classes} role="group" {...rest}>
        <ul className="ui-category-picker__children">
          {categories.map((cat) => (
            <NodeRow
              key={cat.id}
              node={cat}
              selected={selected}
              multiple={multiple}
              depth={0}
              onToggle={toggle}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </ul>
      </div>
    );
  },
);
