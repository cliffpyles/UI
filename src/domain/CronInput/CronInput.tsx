import { forwardRef, useState, type HTMLAttributes } from "react";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Button } from "../../components/Button";
import "./CronInput.css";

export type CronMode = "expert" | "friendly";

export interface CronInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  mode?: CronMode;
  disabled?: boolean;
}

const PRESETS = [
  { value: "* * * * *", label: "Every minute" },
  { value: "0 * * * *", label: "Every hour" },
  { value: "0 0 * * *", label: "Every day at midnight" },
  { value: "0 9 * * 1-5", label: "Weekdays at 9am" },
  { value: "0 0 * * 0", label: "Every Sunday" },
  { value: "0 0 1 * *", label: "First of each month" },
];

export const CronInput = forwardRef<HTMLDivElement, CronInputProps>(
  function CronInput({ value, onChange, mode = "friendly", disabled, className, ...rest }, ref) {
    const [activeMode, setActiveMode] = useState<CronMode>(mode);
    const classes = ["ui-cron-input", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-cron-input__modes" role="tablist">
          <Button
            variant={activeMode === "friendly" ? "primary" : "ghost"}
            size="sm"
            role="tab"
            aria-selected={activeMode === "friendly"}
            onClick={() => setActiveMode("friendly")}
          >
            Common
          </Button>
          <Button
            variant={activeMode === "expert" ? "primary" : "ghost"}
            size="sm"
            role="tab"
            aria-selected={activeMode === "expert"}
            onClick={() => setActiveMode("expert")}
          >
            Expression
          </Button>
        </div>
        {activeMode === "friendly" ? (
          <Select
            aria-label="Schedule"
            options={PRESETS.map((p) => ({ value: p.value, label: p.label }))}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        ) : (
          <Input
            aria-label="Cron expression"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="* * * * *"
            disabled={disabled}
          />
        )}
      </div>
    );
  },
);
