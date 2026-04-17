import { Text } from "../../primitives/Text";
import { Demo } from "../components/Demo";

export default function Overview() {
  return (
    <section>
      <Text as="h2" size="xl" weight="semibold">Overview</Text>

      <Demo title="Status colors" description="Semantic colors for success, warning, error, info.">
        <div className="status-row">
          <span className="status-badge status-badge--success">Success</span>
          <span className="status-badge status-badge--warning">Warning</span>
          <span className="status-badge status-badge--error">Error</span>
          <span className="status-badge status-badge--info">Info</span>
        </div>
      </Demo>

      <Demo title="Surfaces" description="Raised and sunken background tokens.">
        <div style={{ display: "flex", gap: "var(--spacing-content-gap)", flexWrap: "wrap" }}>
          <div className="token-demo">
            <strong>Raised</strong>
            <Text as="p" color="secondary">Cards and panels</Text>
          </div>
          <div className="token-demo" style={{ background: "var(--color-background-surface-sunken)" }}>
            <strong>Sunken</strong>
            <Text as="p" color="secondary">Inset areas and wells</Text>
          </div>
        </div>
      </Demo>

      <Demo title="Typography scale" description="Font-size tokens from 2xs through 2xl.">
        <Text as="p" size="2xs">2xs (10px)</Text>
        <Text as="p" size="xs">xs (12px)</Text>
        <Text as="p" size="sm">sm (14px)</Text>
        <Text as="p" size="base">base (16px)</Text>
        <Text as="p" size="lg">lg (18px)</Text>
        <Text as="p" size="xl">xl (20px)</Text>
        <Text as="p" size="2xl">2xl (24px)</Text>
      </Demo>

      <Demo title="Categorical colors" description="8-color categorical palette for charts.">
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                background: `var(--color-categorical-${i})`,
              }}
            />
          ))}
        </div>
      </Demo>
    </section>
  );
}
