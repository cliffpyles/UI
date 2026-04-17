import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./HierarchicalTreeLayout.css";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  hasChildren?: boolean;
  disabled?: boolean;
}

export interface HierarchicalTreeLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "onToggle"> {
  nodes: TreeNode[];
  selectedId?: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onSelect?: (id: string) => void;
  onToggle?: (id: string, expanded: boolean) => void;
  onLoadChildren?: (id: string) => Promise<void>;
  children: ReactNode;
  treeLabel?: string;
}

function flatten(
  nodes: TreeNode[],
  expanded: Set<string>,
  depth = 0,
): Array<{ node: TreeNode; depth: number }> {
  const result: Array<{ node: TreeNode; depth: number }> = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (expanded.has(node.id) && node.children) {
      result.push(...flatten(node.children, expanded, depth + 1));
    }
  }
  return result;
}

export const HierarchicalTreeLayout = forwardRef<HTMLDivElement, HierarchicalTreeLayoutProps>(
  function HierarchicalTreeLayout(
    {
      nodes,
      selectedId,
      expandedIds,
      defaultExpandedIds = [],
      onSelect,
      onToggle,
      onLoadChildren,
      children,
      treeLabel = "Hierarchy",
      className,
      ...rest
    },
    ref,
  ) {
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
      () => new Set(defaultExpandedIds),
    );
    const controlled = expandedIds !== undefined;
    const expanded = controlled ? new Set(expandedIds) : internalExpanded;

    const toggle = async (id: string, hasChildren: boolean) => {
      if (!hasChildren) return;
      const isOpen = expanded.has(id);
      if (!controlled) {
        setInternalExpanded((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
      onToggle?.(id, !isOpen);
      if (!isOpen && onLoadChildren) {
        await onLoadChildren(id);
      }
    };

    const flat = flatten(nodes, expanded);

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, node: TreeNode, idx: number) => {
      const hasChildren = !!(node.children?.length || node.hasChildren);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (hasChildren && !expanded.has(node.id)) {
          void toggle(node.id, true);
        } else if (idx < flat.length - 1) {
          onSelect?.(flat[idx + 1]!.node.id);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (expanded.has(node.id)) {
          void toggle(node.id, true);
        }
      } else if (e.key === "ArrowDown" && idx < flat.length - 1) {
        e.preventDefault();
        onSelect?.(flat[idx + 1]!.node.id);
      } else if (e.key === "ArrowUp" && idx > 0) {
        e.preventDefault();
        onSelect?.(flat[idx - 1]!.node.id);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(node.id);
      }
    };

    const classes = ["ui-hierarchy-tree", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <aside className="ui-hierarchy-tree__sidebar">
          <div
            role="tree"
            aria-label={treeLabel}
            className="ui-hierarchy-tree__tree"
          >
            {flat.map(({ node, depth }, idx) => {
              const hasChildren = !!(node.children?.length || node.hasChildren);
              const isOpen = expanded.has(node.id);
              const selected = node.id === selectedId;
              return (
                <div
                  key={node.id}
                  role="treeitem"
                  aria-level={depth + 1}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  aria-selected={selected}
                  aria-disabled={node.disabled}
                  tabIndex={selected ? 0 : -1}
                  className={[
                    "ui-hierarchy-tree__item",
                    selected && "ui-hierarchy-tree__item--selected",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => !node.disabled && onSelect?.(node.id)}
                  onKeyDown={(e) => onKeyDown(e, node, idx)}
                  style={{ paddingLeft: `calc(var(--spacing-3) + ${depth * 16}px)` }}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-label={isOpen ? `Collapse ${node.label}` : `Expand ${node.label}`}
                      className="ui-hierarchy-tree__toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggle(node.id, hasChildren);
                      }}
                    >
                      <Icon name={isOpen ? "chevron-down" : "chevron-right"} size="xs" />
                    </button>
                  ) : (
                    <span className="ui-hierarchy-tree__leaf-dot" aria-hidden="true" />
                  )}
                  <span className="ui-hierarchy-tree__label">{node.label}</span>
                </div>
              );
            })}
          </div>
        </aside>
        <div className="ui-hierarchy-tree__content">{children}</div>
      </div>
    );
  },
);
