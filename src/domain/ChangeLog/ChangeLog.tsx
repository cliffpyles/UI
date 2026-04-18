import { Fragment, forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Divider } from "../../primitives/Divider";
import "./ChangeLog.css";

export type FieldChangeKind = "added" | "removed" | "changed";

export interface FieldChange {
  field: string;
  kind?: FieldChangeKind;
  before?: ReactNode;
  after?: ReactNode;
}

export interface ChangeLogProps extends HTMLAttributes<HTMLElement> {
  changes: FieldChange[];
  groupBy?: (change: FieldChange) => string;
  emptyLabel?: ReactNode;
}

function inferKind(c: FieldChange): FieldChangeKind {
  if (c.kind) return c.kind;
  if (c.before == null && c.after != null) return "added";
  if (c.before != null && c.after == null) return "removed";
  return "changed";
}

function displayValue(v: ReactNode): ReactNode {
  if (v == null || v === "") return "\u2014";
  return v;
}

function ChangeRow({ change }: { change: FieldChange }) {
  const kind = inferKind(change);
  return (
    <Box
      direction="row"
      align="center"
      gap="2"
      className="ui-changelog__item"
      aria-label={change.field}
    >
      <Text as="span" size="sm" color="secondary" className="ui-changelog__field">
        {change.field}
      </Text>
      {kind === "added" && (
        <>
          <Text as="span" size="sm" color="secondary">
            added
          </Text>
          <Text as="span" size="sm" color="success">
            {displayValue(change.after)}
          </Text>
        </>
      )}
      {kind === "removed" && (
        <>
          <Text as="span" size="sm" color="secondary">
            removed
          </Text>
          <Text as="span" size="sm" color="error">
            {displayValue(change.before)}
          </Text>
        </>
      )}
      {kind === "changed" && (
        <>
          <Text as="span" size="sm" color="secondary">
            changed from
          </Text>
          <Text as="span" size="sm" color="error">
            {displayValue(change.before)}
          </Text>
          <Text as="span" size="sm" color="secondary">
            to
          </Text>
          <Text as="span" size="sm" color="success">
            {displayValue(change.after)}
          </Text>
        </>
      )}
    </Box>
  );
}

export const ChangeLog = forwardRef<HTMLElement, ChangeLogProps>(
  function ChangeLog(
    { changes, groupBy, emptyLabel = "No changes", className, ...rest },
    ref,
  ) {
    const classes = ["ui-changelog", className].filter(Boolean).join(" ");

    const groups = useMemo(() => {
      if (!groupBy) return null;
      const map = new Map<string, FieldChange[]>();
      for (const c of changes) {
        const key = groupBy(c);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(c);
      }
      return Array.from(map.entries());
    }, [changes, groupBy]);

    return (
      <Box
        as="section"
        ref={ref as React.Ref<HTMLElement>}
        aria-label="Change log"
        direction="column"
        gap="2"
        className={classes}
        {...rest}
      >
        {changes.length === 0 ? (
          <Text as="p" size="sm" color="secondary">
            {emptyLabel}
          </Text>
        ) : groups ? (
          groups.map(([label, groupChanges], i) => (
            <Fragment key={label}>
              {i > 0 && <Divider />}
              <Text as="span" size="xs" weight="semibold" color="secondary">
                {label}
              </Text>
              {groupChanges.map((c) => (
                <ChangeRow key={`${label}:${c.field}`} change={c} />
              ))}
            </Fragment>
          ))
        ) : (
          changes.map((c) => <ChangeRow key={c.field} change={c} />)
        )}
      </Box>
    );
  },
);

ChangeLog.displayName = "ChangeLog";
