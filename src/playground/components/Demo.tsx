import type { ReactNode } from "react";

interface DemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Demo({ title, description, children }: DemoProps) {
  return (
    <div className="pg-demo">
      <header className="pg-demo__head">
        <h3 className="pg-demo__title">{title}</h3>
        {description && <p className="pg-demo__desc">{description}</p>}
      </header>
      <div className="pg-demo__stage">{children}</div>
    </div>
  );
}
