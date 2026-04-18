import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Menu } from "../../components/Menu";
import type { IconName } from "../../primitives/Icon";
import "./ChartHeader.css";

export interface ChartHeaderAction {
  id: string;
  label: string;
  icon?: IconName;
  onSelect: () => void;
  variant?: "default" | "destructive";
}

export interface ChartHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  subtitle?: string;
  timeRangeLabel?: string;
  actions?: ChartHeaderAction[];
  trailing?: ReactNode;
}

export const ChartHeader = forwardRef<HTMLDivElement, ChartHeaderProps>(
  function ChartHeader(
    { title, subtitle, timeRangeLabel, actions, trailing, className, ...rest },
    ref,
  ) {
    const classes = ["ui-chart-header", className].filter(Boolean).join(" ");
    const hasActions = !!actions && actions.length > 0;
    const hasRight = !!timeRangeLabel || !!trailing || hasActions;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="row"
        justify="between"
        align="center"
        gap="3"
        className={classes}
        {...rest}
      >
        <Box direction="column" gap="1" className="ui-chart-header__text">
          <Text as="h3" size="base" weight="semibold" color="primary">
            {title}
          </Text>
          {subtitle && (
            <Text as="p" size="sm" color="secondary">
              {subtitle}
            </Text>
          )}
        </Box>
        {hasRight && (
          <Box
            direction="row"
            align="center"
            gap="2"
            className="ui-chart-header__right"
          >
            {timeRangeLabel && (
              <Text as="span" size="sm" color="secondary">
                {timeRangeLabel}
              </Text>
            )}
            {trailing}
            {hasActions && (
              <Menu>
                <Menu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    aria-label="Chart actions"
                  />
                </Menu.Trigger>
                <Menu.List>
                  {actions!.map((action) => (
                    <Menu.Item
                      key={action.id}
                      onSelect={action.onSelect}
                      data-variant={action.variant}
                    >
                      <Text as="span" size="sm">
                        {action.label}
                      </Text>
                    </Menu.Item>
                  ))}
                </Menu.List>
              </Menu>
            )}
          </Box>
        )}
      </Box>
    );
  },
);

ChartHeader.displayName = "ChartHeader";
