import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Button } from "../../components/Button";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
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
        <Button
          variant="ghost"
          size="sm"
          className="ui-filter-chip__trigger"
          onClick={onActivate}
          disabled={!onActivate}
          aria-label={`Edit filter: ${field} ${operator} ${String(value)}`}
        >
          <Box display="inline-flex" align="center" gap="1">
            <Text as="span" weight="medium" color="secondary" className="ui-filter-chip__field">{field}</Text>
            <Text as="span" color="tertiary" className="ui-filter-chip__operator">{operator}</Text>
            <Text as="span" className="ui-filter-chip__value">{value}</Text>
          </Box>
        </Button>
        {removable && (
          <Button
            variant="ghost"
            size="sm"
            className="ui-filter-chip__remove"
            onClick={onRemove}
            aria-label={`Remove filter ${field}`}
          >
            <Icon name="x" size="xs" aria-hidden />
          </Button>
        )}
      </span>
    );
  },
);
