import type { ReactNode } from "react";
import { Text } from "../../primitives/Text";

interface DemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Demo({ title, description, children }: DemoProps) {
  return (
    <div className="pg-demo">
      <header className="pg-demo__head">
        <Text as="h3" className="pg-demo__title" size="sm" weight="semibold" family="mono">
          {title}
        </Text>
        {description && (
          <Text as="p" className="pg-demo__desc" size="xs" color="tertiary">
            {description}
          </Text>
        )}
      </header>
      <div className="pg-demo__stage">{children}</div>
    </div>
  );
}
