import { forwardRef, type HTMLAttributes } from "react";
import { Select } from "../../components/Select";
import { Toggle } from "../../components/Toggle";
import { Box } from "../../primitives/Box";
import "./PermissionRow.css";

export interface PermissionOption {
  value: string;
  label: string;
}

export interface PermissionRowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  action: string;
  resource?: string;
  description?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  options?: PermissionOption[];
  disabled?: boolean;
}

export const PermissionRow = forwardRef<HTMLDivElement, PermissionRowProps>(
  function PermissionRow(
    { action, resource, description, value, onChange, options, disabled, className, ...rest },
    ref,
  ) {
    const classes = ["ui-permission-row", className].filter(Boolean).join(" ");
    const label = resource ? `${action} ${resource}` : action;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        display="flex"
        align="center"
        gap="3"
        {...rest}
      >
        <Box className="ui-permission-row__body" grow minWidth={0}>
          <div className="ui-permission-row__label">{label}</div>
          {description && (
            <div className="ui-permission-row__description">{description}</div>
          )}
        </Box>
        {options ? (
          <Select
            aria-label={label}
            value={String(value)}
            onChange={onChange}
            options={options}
            disabled={disabled}
          />
        ) : (
          <Toggle
            aria-label={label}
            checked={Boolean(value)}
            onChange={(v) => onChange(v)}
            disabled={disabled}
          />
        )}
      </Box>
    );
  },
);
