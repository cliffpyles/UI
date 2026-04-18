import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Menu } from "../../components/Menu";
import "./CategoryPicker.css";

export interface CategoryNode {
  id: string;
  label: string;
  children?: CategoryNode[];
}

export interface CategoryPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: CategoryNode[];
  value: string | null;
  onChange: (id: string, path: CategoryNode[]) => void;
  placeholder?: string;
  allowBranchSelection?: boolean;
  disabled?: boolean;
}

function findPath(
  options: CategoryNode[],
  id: string,
): CategoryNode[] | null {
  for (const node of options) {
    if (node.id === id) return [node];
    if (node.children) {
      const sub = findPath(node.children, id);
      if (sub) return [node, ...sub];
    }
  }
  return null;
}

export const CategoryPicker = forwardRef<HTMLDivElement, CategoryPickerProps>(
  function CategoryPicker(
    {
      options,
      value,
      onChange,
      placeholder = "Select category",
      allowBranchSelection = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) {
    const [drill, setDrill] = useState<CategoryNode[]>([]);
    const [open, setOpen] = useState(false);
    const forceOpenRef = useRef(false);
    const classes = ["ui-category-picker", className].filter(Boolean).join(" ");
    const selectedPath = useMemo(
      () => (value ? findPath(options, value) : null),
      [options, value],
    );
    const currentLevel =
      drill.length === 0
        ? options
        : (drill[drill.length - 1].children ?? []);

    function handleOpenChange(next: boolean) {
      if (!next && forceOpenRef.current) {
        forceOpenRef.current = false;
        return;
      }
      setOpen(next);
      if (!next) setDrill([]);
    }

    function handleSelect(node: CategoryNode) {
      const isLeaf = !node.children || node.children.length === 0;
      if (!isLeaf && !allowBranchSelection) {
        forceOpenRef.current = true;
        setDrill((prev) => [...prev, node]);
        return;
      }
      const fullPath = [...drill, node];
      onChange(node.id, fullPath);
      setOpen(false);
      setDrill([]);
    }

    function handleBack() {
      forceOpenRef.current = true;
      setDrill((prev) => prev.slice(0, -1));
    }

    const triggerLabel = selectedPath
      ? selectedPath.map((n) => n.label).join(" / ")
      : placeholder;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="row"
        align="center"
        gap="2"
        className={classes}
        {...rest}
      >
        <Menu open={open} onOpenChange={handleOpenChange}>
          <Menu.Trigger asChild>
            <Button variant="secondary" size="md" disabled={disabled}>
              <Text
                as="span"
                size="sm"
                color={selectedPath ? "primary" : "secondary"}
              >
                {triggerLabel}
              </Text>
            </Button>
          </Menu.Trigger>
          <Menu.List>
            {drill.length > 0 && (
              <>
                <Menu.Item onSelect={handleBack}>
                  <Text as="span" size="sm" color="secondary">
                    ← {drill[drill.length - 1].label}
                  </Text>
                </Menu.Item>
                <Menu.Separator />
              </>
            )}
            {currentLevel.length === 0 ? (
              <Menu.Item aria-disabled>
                <Text as="span" size="sm" color="secondary">
                  Empty
                </Text>
              </Menu.Item>
            ) : (
              currentLevel.map((node) => {
                const hasChildren = !!node.children?.length;
                return (
                  <Menu.Item
                    key={node.id}
                    onSelect={() => handleSelect(node)}
                  >
                    <Box direction="row" align="center" justify="between" gap="3">
                      <Text as="span" size="sm">
                        {node.label}
                      </Text>
                      {hasChildren && (
                        <Text as="span" size="xs" color="secondary">
                          ›
                        </Text>
                      )}
                    </Box>
                  </Menu.Item>
                );
              })
            )}
          </Menu.List>
        </Menu>
      </Box>
    );
  },
);

CategoryPicker.displayName = "CategoryPicker";
