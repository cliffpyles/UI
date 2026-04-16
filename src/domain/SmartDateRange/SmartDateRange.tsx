import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
  defaultPresets,
  toInputValue,
  type DateRangePreset,
  type DateRangeValue,
} from "./presets";
import "./SmartDateRange.css";

export interface SmartDateRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  presets?: DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  now?: Date;
}

export const SmartDateRange = forwardRef<HTMLDivElement, SmartDateRangeProps>(
  function SmartDateRange(
    { value, onChange, presets = defaultPresets, minDate, maxDate, now, className, ...rest },
    ref,
  ) {
    const classes = ["ui-smart-date-range", className].filter(Boolean).join(" ");
    const reference = now ?? new Date();

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-smart-date-range__presets" role="group" aria-label="Presets">
          {presets.map((p) => (
            <Button
              key={p.id}
              variant="ghost"
              size="sm"
              onClick={() => onChange(p.compute(reference))}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="ui-smart-date-range__inputs">
          <Input
            aria-label="Start date"
            type="date"
            value={toInputValue(value.start)}
            min={minDate ? toInputValue(minDate) : undefined}
            max={maxDate ? toInputValue(maxDate) : undefined}
            onChange={(e) =>
              onChange({ ...value, start: e.target.value ? new Date(e.target.value) : null })
            }
          />
          <span className="ui-smart-date-range__separator" aria-hidden="true">–</span>
          <Input
            aria-label="End date"
            type="date"
            value={toInputValue(value.end)}
            min={minDate ? toInputValue(minDate) : undefined}
            max={maxDate ? toInputValue(maxDate) : undefined}
            onChange={(e) =>
              onChange({ ...value, end: e.target.value ? new Date(e.target.value) : null })
            }
          />
        </div>
      </div>
    );
  },
);
