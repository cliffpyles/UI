import { forwardRef, type HTMLAttributes } from "react";
import { Text } from "../../primitives/Text";
import { formatDuration, type DurationStyle } from "../../utils";

export interface DurationProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  value: number | null | undefined;
  format?: DurationStyle;
}

export const Duration = forwardRef<HTMLSpanElement, DurationProps>(
  function Duration({ value, format = "human", className, ...rest }, ref) {
    return (
      <Text as="span" tabularNums color="inherit" ref={ref} className={["ui-duration", className].filter(Boolean).join(" ")} {...rest}>
        {formatDuration(value, { style: format })}
      </Text>
    );
  },
);
