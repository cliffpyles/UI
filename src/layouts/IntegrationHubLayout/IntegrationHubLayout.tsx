import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import "./IntegrationHubLayout.css";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface IntegrationCategory {
  id: string;
  label: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  icon?: ReactNode;
  description?: string;
}

export interface IntegrationHubLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  categories: IntegrationCategory[];
  integrations: Integration[];
  activeCategoryId?: string | "all";
  onCategoryChange?: (id: string | "all") => void;
  onSelect?: (id: string) => void;
  toolbar?: ReactNode;
  label?: string;
}

const statusLabel: Record<IntegrationStatus, string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
};

export const IntegrationHubLayout = forwardRef<
  HTMLDivElement,
  IntegrationHubLayoutProps
>(function IntegrationHubLayout(
  {
    categories,
    integrations,
    activeCategoryId,
    onCategoryChange,
    onSelect,
    toolbar,
    label = "Integration hub",
    className,
    ...rest
  },
  ref,
) {
  const [internalActive, setInternalActive] = useState<string | "all">("all");
  const active = activeCategoryId ?? internalActive;

  const setActive = (id: string | "all") => {
    if (activeCategoryId === undefined) setInternalActive(id);
    onCategoryChange?.(id);
  };

  const filtered =
    active === "all"
      ? integrations
      : integrations.filter((i) => i.category === active);

  const classes = ["ui-integration-hub", className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      role="region"
      aria-label={label}
      {...rest}
    >
      {toolbar && (
        <Box align="center" gap="inline" className="ui-integration-hub__toolbar">
          {toolbar}
        </Box>
      )}
      <div className="ui-integration-hub__body">
        <nav
          className="ui-integration-hub__sidebar"
          aria-label="Integration categories"
        >
          <ul className="ui-integration-hub__cat-list">
            <li>
              <Button
                variant="ghost"
                size="sm"
                className={[
                  "ui-integration-hub__cat",
                  active === "all" && "ui-integration-hub__cat--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active === "all" ? "true" : undefined}
                onClick={() => setActive("all")}
              >
                All
              </Button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={[
                    "ui-integration-hub__cat",
                    active === c.id && "ui-integration-hub__cat--active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={active === c.id ? "true" : undefined}
                  onClick={() => setActive(c.id)}
                >
                  {c.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="ui-integration-hub__grid">
          {filtered.map((i) => (
            <li key={i.id} className="ui-integration-hub__item">
              <Button
                variant="ghost"
                size="sm"
                className="ui-integration-hub__card"
                onClick={() => onSelect?.(i.id)}
              >
                <Box display="inline-flex" direction="column" gap="2">
                  <div className="ui-integration-hub__card-head">
                    {i.icon && (
                      <span
                        className="ui-integration-hub__icon"
                        aria-hidden="true"
                      >
                        {i.icon}
                      </span>
                    )}
                    <Text as="span" size="label" weight="semibold" className="ui-integration-hub__name">
                      {i.name}
                    </Text>
                    <span
                      className={`ui-integration-hub__status ui-integration-hub__status--${i.status}`}
                    >
                      {statusLabel[i.status]}
                    </span>
                  </div>
                  {i.description && (
                    <Text as="p" size="xs" color="secondary" className="ui-integration-hub__desc">
                      {i.description}
                    </Text>
                  )}
                </Box>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
