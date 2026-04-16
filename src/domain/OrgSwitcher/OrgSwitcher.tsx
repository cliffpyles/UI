import { forwardRef, type HTMLAttributes } from "react";
import { Select } from "../../components/Select";
import "./OrgSwitcher.css";

export interface OrgData {
  id: string;
  name: string;
  slug?: string;
}

export interface OrgSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  orgs: OrgData[];
  currentOrg: OrgData | string | null;
  onChange: (orgId: string) => void;
  label?: string;
  disabled?: boolean;
}

export const OrgSwitcher = forwardRef<HTMLDivElement, OrgSwitcherProps>(
  function OrgSwitcher(
    { orgs, currentOrg, onChange, label = "Organization", disabled, className, ...rest },
    ref,
  ) {
    const currentId = typeof currentOrg === "string" ? currentOrg : currentOrg?.id ?? "";
    const classes = ["ui-org-switcher", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <Select
          aria-label={label}
          value={currentId}
          onChange={onChange}
          disabled={disabled}
          options={orgs.map((o) => ({ value: o.id, label: o.name }))}
        />
      </div>
    );
  },
);
