import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SettingsFrame.css";

export interface SettingsCategory {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SettingsFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  categories: SettingsCategory[];
  activeId: string;
  onChange: (id: string) => void;
  heading?: ReactNode;
  children: ReactNode;
}

export const SettingsFrame = forwardRef<HTMLDivElement, SettingsFrameProps>(
  function SettingsFrame(
    { categories, activeId, onChange, heading, children, className, ...rest },
    ref,
  ) {
    const classes = ["ui-settings-frame", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <nav aria-label="Settings categories" className="ui-settings-frame__nav">
          {heading && <div className="ui-settings-frame__heading">{heading}</div>}
          <ul className="ui-settings-frame__list">
            {categories.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    disabled={c.disabled}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "ui-settings-frame__item",
                      active && "ui-settings-frame__item--active",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => onChange(c.id)}
                  >
                    <span className="ui-settings-frame__item-label">{c.label}</span>
                    {c.description && (
                      <span className="ui-settings-frame__item-desc">
                        {c.description}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ui-settings-frame__content">{children}</div>
      </div>
    );
  },
);
