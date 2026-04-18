import { forwardRef, type HTMLAttributes } from "react";
import { Menu } from "../../components/Menu";
import { Icon, type IconName } from "../../primitives/Icon";
import "./RowActionsMenu.css";

export interface ActionDef<T = unknown> {
  id: string;
  label: string;
  icon?: IconName;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: (row: T) => void;
}

export interface RowActionsMenuProps<T = unknown>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  actions: ActionDef<T>[];
  row: T;
  label?: string;
}

function RowActionsMenuInner<T>(
  { actions, row, label = "Row actions", className, ...rest }: RowActionsMenuProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const classes = ["ui-row-actions-menu", className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} {...rest}>
      <Menu>
        <Menu.Trigger className="ui-row-actions-menu__trigger" aria-label={label}>
          <Icon name="more-horizontal" size="sm" aria-hidden />
        </Menu.Trigger>
        <Menu.List className="ui-row-actions-menu__menu">
          {actions.map((a) => (
            <Menu.Item
              key={a.id}
              disabled={a.disabled}
              className={
                "ui-row-actions-menu__item" +
                (a.destructive ? " ui-row-actions-menu__item--destructive" : "")
              }
              onSelect={() => a.onSelect(row)}
            >
              {a.icon && <Icon name={a.icon} size="xs" aria-hidden />}
              {a.label}
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>
    </div>
  );
}

export const RowActionsMenu = forwardRef(RowActionsMenuInner) as <T>(
  props: RowActionsMenuProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof RowActionsMenuInner>;
