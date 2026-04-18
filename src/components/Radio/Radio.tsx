import {
  forwardRef,
  createContext,
  useContext,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./Radio.css";

// --- RadioGroup Context ---

interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// --- RadioGroup ---

interface RadioGroupOwnProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Shared name for the radio inputs */
  name?: string;
  /** Layout orientation */
  orientation?: "horizontal" | "vertical";
  /** Whether all radios in the group are disabled */
  disabled?: boolean;
  children: ReactNode;
}

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  >;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      value: controlledValue,
      defaultValue,
      onChange,
      name,
      orientation = "vertical",
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const autoName = useId();
    const groupName = name || autoName;

    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleChange = (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const classes = [
      "ui-radio-group",
      `ui-radio-group--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <RadioGroupContext.Provider
        value={{ name: groupName, value: currentValue, disabled, onChange: handleChange }}
      >
        <Box
          ref={ref as React.Ref<HTMLElement>}
          role="radiogroup"
          className={classes}
          aria-orientation={orientation}
          direction={orientation === "horizontal" ? "row" : "column"}
          gap={orientation === "horizontal" ? "4" : "content"}
          {...props}
        >
          {children}
        </Box>
      </RadioGroupContext.Provider>
    );
  },
);

// --- Radio ---

interface RadioOwnProps {
  /** Value for this radio option */
  value: string;
  /** Label text */
  label?: ReactNode;
  /** Description text */
  description?: ReactNode;
  /** Whether this individual radio is disabled */
  disabled?: boolean;
}

export type RadioProps = RadioOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    { value, label, description, disabled: disabledProp = false, className, ...props },
    ref,
  ) {
    const group = useContext(RadioGroupContext);
    const isDisabled = disabledProp || group?.disabled || false;
    const isChecked = group ? group.value === value : undefined;
    const name = group?.name;

    const handleChange = () => {
      group?.onChange(value);
    };

    const classes = [
      "ui-radio",
      isDisabled && "ui-radio--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={classes}>
        <Box direction="row" align="start" gap="2" className="ui-radio__row">
          <input
            ref={ref}
            type="radio"
            className="ui-radio__input"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={isDisabled}
            {...props}
          />
          <span className="ui-radio__control" aria-hidden="true">
            <span className="ui-radio__dot" />
          </span>
          {(label || description) && (
            <Box direction="column" gap="0.5" className="ui-radio__content">
              {label && (
                <Text as="span" size="body" color="primary" className="ui-radio__label">
                  {label}
                </Text>
              )}
              {description && (
                <Text as="span" size="caption" color="secondary" className="ui-radio__description">
                  {description}
                </Text>
              )}
            </Box>
          )}
        </Box>
      </label>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
