import {
  forwardRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Input } from "../../components/Input";
import { Radio, RadioGroup } from "../../components/Radio";
import { Select } from "../../components/Select";
import "./CronInput.css";

export type CronMode = "friendly" | "expert";

export interface CronInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;
  onChange: (cron: string) => void;
  mode?: CronMode;
  onModeChange?: (mode: CronMode) => void;
  disabled?: boolean;
  invalid?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: "minute", label: "Every minute" },
  { value: "hour", label: "Every hour" },
  { value: "day", label: "Every day" },
  { value: "week", label: "Every week" },
  { value: "month", label: "Every month" },
];

const DAY_OPTIONS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: String(h),
  label: `${String(h).padStart(2, "0")}:00`,
}));

interface Parsed {
  frequency: string;
  hour: string;
  day: string;
}

function parseCron(cron: string): Parsed {
  const parts = cron.trim().split(/\s+/);
  const [, hour = "*", , , dow = "*"] = parts.length === 5 ? parts : ["*", "*", "*", "*", "*"];
  if (parts[0] === "*" && hour === "*") return { frequency: "minute", hour: "0", day: "0" };
  if (hour === "*") return { frequency: "hour", hour: "0", day: "0" };
  if (dow !== "*") return { frequency: "week", hour, day: dow };
  if (parts[2] !== "*") return { frequency: "month", hour, day: "0" };
  return { frequency: "day", hour, day: "0" };
}

function toCron({ frequency, hour, day }: Parsed): string {
  switch (frequency) {
    case "minute":
      return "* * * * *";
    case "hour":
      return "0 * * * *";
    case "day":
      return `0 ${hour} * * *`;
    case "week":
      return `0 ${hour} * * ${day}`;
    case "month":
      return `0 ${hour} 1 * *`;
    default:
      return "0 * * * *";
  }
}

function describeCron(cron: string): string {
  const p = parseCron(cron);
  const hourLabel = HOUR_OPTIONS.find((h) => h.value === p.hour)?.label ?? "00:00";
  const dayLabel = DAY_OPTIONS.find((d) => d.value === p.day)?.label ?? "Sunday";
  switch (p.frequency) {
    case "minute":
      return "Every minute";
    case "hour":
      return "Every hour";
    case "day":
      return `Every day at ${hourLabel}`;
    case "week":
      return `${dayLabel} at ${hourLabel}`;
    case "month":
      return `First of each month at ${hourLabel}`;
    default:
      return cron;
  }
}

export const CronInput = forwardRef<HTMLDivElement, CronInputProps>(
  function CronInput(
    {
      value,
      onChange,
      mode: modeProp,
      onModeChange,
      disabled = false,
      invalid = false,
      className,
      ...rest
    },
    ref,
  ) {
    const [internalMode, setInternalMode] = useState<CronMode>(modeProp ?? "friendly");
    const mode = modeProp ?? internalMode;
    const parsed = parseCron(value);

    const classes = ["ui-cron-input", className].filter(Boolean).join(" ");

    const setMode = (next: CronMode) => {
      if (modeProp === undefined) setInternalMode(next);
      onModeChange?.(next);
    };

    const updateFriendly = (patch: Partial<Parsed>) => {
      onChange(toCron({ ...parsed, ...patch }));
    };

    return (
      <Box
        as="div"
        ref={ref}
        direction="column"
        gap="2"
        className={classes}
        {...rest}
      >
        <RadioGroup
          value={mode}
          onChange={(v) => setMode(v as CronMode)}
          orientation="horizontal"
          disabled={disabled}
          aria-label="Schedule mode"
        >
          <Radio value="friendly" label="Friendly" />
          <Radio value="expert" label="Expert" />
        </RadioGroup>

        {mode === "friendly" ? (
          <Box direction="row" gap="2" wrap>
            <Select
              aria-label="Frequency"
              options={FREQUENCY_OPTIONS}
              value={parsed.frequency}
              onChange={(v) => updateFriendly({ frequency: v })}
              disabled={disabled}
            />
            {(parsed.frequency === "day" ||
              parsed.frequency === "week" ||
              parsed.frequency === "month") && (
              <Select
                aria-label="Hour"
                options={HOUR_OPTIONS}
                value={parsed.hour}
                onChange={(v) => updateFriendly({ hour: v })}
                disabled={disabled}
              />
            )}
            {parsed.frequency === "week" && (
              <Select
                aria-label="Day of week"
                options={DAY_OPTIONS}
                value={parsed.day}
                onChange={(v) => updateFriendly({ day: v })}
                disabled={disabled}
              />
            )}
          </Box>
        ) : (
          <Input
            aria-label="Cron expression"
            aria-invalid={invalid || undefined}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="* * * * *"
            disabled={disabled}
            error={invalid}
          />
        )}

        {invalid && mode === "expert" && (
          <Text as="p" size="caption" color="error" className="ui-cron-input__error">
            Invalid cron expression
          </Text>
        )}

        <Text as="p" size="caption" color="secondary" className="ui-cron-input__preview">
          {describeCron(value)}
        </Text>
      </Box>
    );
  },
);
