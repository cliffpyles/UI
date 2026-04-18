import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import "./UserManagementLayout.css";

export interface UserManagementLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  table: ReactNode;
  footer?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
  label?: string;
}

export const UserManagementLayout = forwardRef<HTMLDivElement, UserManagementLayoutProps>(
  function UserManagementLayout(
    { toolbar, table, footer, selectedCount = 0, bulkActions, label = "User management", className, ...rest },
    ref,
  ) {
    const classes = ["ui-user-management", className].filter(Boolean).join(" ");
    const showBulk = selectedCount > 0 && bulkActions;

    return (
      <Box
        as="section"
        ref={ref as Ref<HTMLElement>}
        display="flex"
        direction="column"
        gap="content"
        padding="page"
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {toolbar && (
          <Box
            display="flex"
            wrap
            align="center"
            gap="inline"
            className="ui-user-management__toolbar"
          >
            {toolbar}
          </Box>
        )}
        {showBulk && (
          <Box
            display="flex"
            align="center"
            justify="between"
            gap="inline"
            className="ui-user-management__bulk"
            role="status"
            aria-live="polite"
          >
            <Text
              as="span"
              size="label"
              weight="medium"
              className="ui-user-management__bulk-count"
            >
              {selectedCount} selected
            </Text>
            <Box display="flex" gap="inline" className="ui-user-management__bulk-actions">
              {bulkActions}
            </Box>
          </Box>
        )}
        <div className="ui-user-management__table">{table}</div>
        {footer && (
          <Box
            display="flex"
            align="center"
            justify="between"
            gap="inline"
            className="ui-user-management__footer"
          >
            {footer}
          </Box>
        )}
      </Box>
    );
  },
);
