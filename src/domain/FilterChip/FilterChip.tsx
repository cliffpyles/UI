import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Icon } from "../../primitives/Icon";
import "./FilterChip.css";

export interface FilterChipProps extends HTMLAttributes<HTMLSpanElement> {
  field: string;
  operator?: string;
  value: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  onActivate?: () => void;
}

export const FilterChip = forwardRef<HTMLSpanElement, FilterChipProps>(
  function FilterChip(
    { field, operator = "=", value, removable = true, onRemove, onActivate, className, ...rest },
    ref,
  ) {
    const classes = ["ui-filter-chip", className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        <button
          type="button"
          className="ui-filter-chip__trigger"
          onClick={onActivate}
          disabled={!onActivate}
          aria-label={`Edit filter: ${field} ${operator} ${String(value)}`}
        >
          <span className="ui-filter-chip__field">{field}</span>
          <span className="ui-filter-chip__operator">{operator}</span>
          <span className="ui-filter-chip__value">{value}</span>
        </button>
        {removable && (
          <button
            type="button"
            className="ui-filter-chip__remove"
            onClick={onRemove}
            aria-label={`Remove filter ${field}`}
          >
            <Icon name="x" size="xs" aria-hidden />
          </button>
        )}
      </span>
    );
  },
);
