import { forwardRef, type HTMLAttributes } from "react";
import { Text } from "../../primitives/Text";
import { formatBytes } from "../../utils";

export interface FileSizeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  bytes: number | null | undefined;
  precision?: number;
}

export const FileSize = forwardRef<HTMLSpanElement, FileSizeProps>(
  function FileSize({ bytes, precision, className, ...rest }, ref) {
    return (
      <Text as="span" tabularNums color="inherit" ref={ref} className={["ui-file-size", className].filter(Boolean).join(" ")} {...rest}>
        {formatBytes(bytes, { decimals: precision })}
      </Text>
    );
  },
);
