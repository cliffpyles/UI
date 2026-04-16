import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const classes = ["ui-row-actions-menu", className].filter(Boolean).join(" ");

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={classes}
      {...rest}
    >
      <button
        type="button"
        className="ui-row-actions-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
      >
        <Icon name="more-horizontal" size="sm" aria-hidden />
      </button>
      {open && (
        <div className="ui-row-actions-menu__menu" role="menu">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              disabled={a.disabled}
              className={
                "ui-row-actions-menu__item" +
                (a.destructive ? " ui-row-actions-menu__item--destructive" : "")
              }
              onClick={() => {
                a.onSelect(row);
                setOpen(false);
              }}
            >
              {a.icon && <Icon name={a.icon} size="xs" aria-hidden />}
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const RowActionsMenu = forwardRef(RowActionsMenuInner) as <T>(
  props: RowActionsMenuProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof RowActionsMenuInner>;
