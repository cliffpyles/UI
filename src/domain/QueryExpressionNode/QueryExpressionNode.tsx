import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import { Select } from "../../components/Select";
import { FilterChip } from "../FilterChip";
import "./QueryExpressionNode.css";

export type LogicalOp = "AND" | "OR";

export interface QueryLeaf {
  kind: "leaf";
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean | null;
}

export interface QueryGroup {
  kind: "group";
  id: string;
  op: LogicalOp;
  children: QueryNode[];
}

export type QueryNode = QueryLeaf | QueryGroup;

export interface QueryExpressionNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  node: QueryNode;
  onChange: (node: QueryNode) => void;
  onRemove?: () => void;
  depth?: number;
  maxDepth?: number;
  onAddLeaf?: () => QueryLeaf;
}

const defaultAddLeaf = (): QueryLeaf => ({
  kind: "leaf",
  id: `leaf-${Math.random().toString(36).slice(2)}`,
  field: "",
  operator: "eq",
  value: null,
});

interface NodeRendererProps {
  node: QueryNode;
  onChange: (node: QueryNode) => void;
  onRemove?: () => void;
  depth: number;
  maxDepth: number;
  onAddLeaf?: () => QueryLeaf;
}

function NodeRenderer({
  node,
  onChange,
  onRemove,
  depth,
  maxDepth,
  onAddLeaf,
}: NodeRendererProps) {
  if (node.kind === "leaf") {
    return (
      <FilterChip
        field={node.field || "field"}
        operator={node.operator}
        value={String(node.value ?? "")}
        onRemove={onRemove}
      />
    );
  }

  const addLeaf = () => {
    const leaf = (onAddLeaf ?? defaultAddLeaf)();
    onChange({ ...node, children: [...node.children, leaf] });
  };

  const addGroup = () => {
    const group: QueryGroup = {
      kind: "group",
      id: `group-${Math.random().toString(36).slice(2)}`,
      op: "AND",
      children: [],
    };
    onChange({ ...node, children: [...node.children, group] });
  };

  const updateChild = (index: number, child: QueryNode) => {
    const next = [...node.children];
    next[index] = child;
    onChange({ ...node, children: next });
  };

  const removeChild = (index: number) => {
    const next = node.children.filter((_, i) => i !== index);
    onChange({ ...node, children: next });
  };

  return (
    <div
      className={`ui-query-expression__group ui-query-expression__group--depth-${Math.min(depth, maxDepth)}`}
    >
      <div className="ui-query-expression__header">
        <Select
          aria-label="Combinator"
          options={[
            { value: "AND", label: "AND" },
            { value: "OR", label: "OR" },
          ]}
          value={node.op}
          onChange={(v) => onChange({ ...node, op: v as LogicalOp })}
          size="sm"
        />
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Remove group">
            <Icon name="x" size="xs" aria-hidden />
          </Button>
        )}
      </div>
      <ul className="ui-query-expression__children">
        {node.children.map((child, i) => (
          <li key={child.id}>
            <NodeRenderer
              node={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              onAddLeaf={onAddLeaf}
              onChange={(next) => updateChild(i, next)}
              onRemove={() => removeChild(i)}
            />
          </li>
        ))}
      </ul>
      <div className="ui-query-expression__actions">
        <Button variant="ghost" size="sm" onClick={addLeaf}>
          <Icon name="plus" size="xs" aria-hidden /> Add condition
        </Button>
        {depth < maxDepth && (
          <Button variant="ghost" size="sm" onClick={addGroup}>
            <Icon name="plus" size="xs" aria-hidden /> Add group
          </Button>
        )}
      </div>
    </div>
  );
}

export const QueryExpressionNode = forwardRef<HTMLDivElement, QueryExpressionNodeProps>(
  function QueryExpressionNode(
    { node, onChange, onRemove, depth = 0, maxDepth = 3, onAddLeaf, className, ...rest },
    ref,
  ) {
    const classes = ["ui-query-expression", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <NodeRenderer
          node={node}
          onChange={onChange}
          onRemove={onRemove}
          depth={depth}
          maxDepth={maxDepth}
          onAddLeaf={onAddLeaf}
        />
      </div>
    );
  },
);
