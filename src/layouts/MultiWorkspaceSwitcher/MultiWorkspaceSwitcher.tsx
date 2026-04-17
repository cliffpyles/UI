import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./MultiWorkspaceSwitcher.css";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  recent?: boolean;
}

export interface MultiWorkspaceSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  workspaces: Workspace[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate?: () => void;
  searchPlaceholder?: string;
}

export const MultiWorkspaceSwitcher = forwardRef<HTMLDivElement, MultiWorkspaceSwitcherProps>(
  function MultiWorkspaceSwitcher(
    {
      workspaces,
      activeId,
      onSwitch,
      onCreate,
      searchPlaceholder = "Search workspaces…",
      className,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement | null>(null);

    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const active = workspaces.find((w) => w.id === activeId);

    const { recent, others } = useMemo(() => {
      const q = query.trim().toLowerCase();
      const filter = (w: Workspace) =>
        !q || w.name.toLowerCase().includes(q) || (w.description ?? "").toLowerCase().includes(q);
      return {
        recent: workspaces.filter((w) => w.recent && filter(w)),
        others: workspaces.filter((w) => !w.recent && filter(w)),
      };
    }, [workspaces, query]);

    const classes = ["ui-workspace-switcher", className].filter(Boolean).join(" ");

    return (
      <div ref={setRefs} className={classes} {...rest}>
        <button
          type="button"
          className="ui-workspace-switcher__trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {active?.avatarUrl ? (
            <img
              src={active.avatarUrl}
              alt=""
              className="ui-workspace-switcher__avatar"
            />
          ) : (
            <span className="ui-workspace-switcher__initial" aria-hidden="true">
              {active?.name.charAt(0) ?? "?"}
            </span>
          )}
          <span className="ui-workspace-switcher__name">
            {active?.name ?? "Select workspace"}
          </span>
          <Icon name="chevron-down" size="xs" />
        </button>
        {open && (
          <div className="ui-workspace-switcher__menu">
            <div className="ui-workspace-switcher__search">
              <Icon name="search" size="sm" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search workspaces"
              />
            </div>
            {recent.length > 0 && (
              <>
                <div className="ui-workspace-switcher__group-header">Recent</div>
                <ul className="ui-workspace-switcher__list">
                  {recent.map((w) => (
                    <WorkspaceRow
                      key={w.id}
                      workspace={w}
                      active={w.id === activeId}
                      onSelect={() => {
                        onSwitch(w.id);
                        setOpen(false);
                      }}
                    />
                  ))}
                </ul>
              </>
            )}
            {others.length > 0 && (
              <>
                {recent.length > 0 && (
                  <div className="ui-workspace-switcher__group-header">
                    All workspaces
                  </div>
                )}
                <ul className="ui-workspace-switcher__list">
                  {others.map((w) => (
                    <WorkspaceRow
                      key={w.id}
                      workspace={w}
                      active={w.id === activeId}
                      onSelect={() => {
                        onSwitch(w.id);
                        setOpen(false);
                      }}
                    />
                  ))}
                </ul>
              </>
            )}
            {onCreate && (
              <button
                type="button"
                className="ui-workspace-switcher__create"
                onClick={() => {
                  onCreate();
                  setOpen(false);
                }}
              >
                <Icon name="plus" size="sm" />
                Create workspace
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

function WorkspaceRow({
  workspace,
  active,
  onSelect,
}: {
  workspace: Workspace;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        className={[
          "ui-workspace-switcher__item",
          active && "ui-workspace-switcher__item--active",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onSelect}
      >
        {workspace.avatarUrl ? (
          <img src={workspace.avatarUrl} alt="" className="ui-workspace-switcher__avatar" />
        ) : (
          <span className="ui-workspace-switcher__initial" aria-hidden="true">
            {workspace.name.charAt(0)}
          </span>
        )}
        <span className="ui-workspace-switcher__item-text">
          <span className="ui-workspace-switcher__item-name">{workspace.name}</span>
          {workspace.description && (
            <span className="ui-workspace-switcher__item-desc">
              {workspace.description}
            </span>
          )}
        </span>
        {active && <Icon name="check" size="sm" />}
      </button>
    </li>
  );
}
