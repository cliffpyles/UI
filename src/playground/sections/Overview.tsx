import { Demo } from "../components/Demo";

export default function Overview() {
  return (
    <section>
      <h2>Overview</h2>

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
            <p style={{ color: "var(--color-text-secondary)" }}>Cards and panels</p>
          </div>
          <div className="token-demo" style={{ background: "var(--color-background-surface-sunken)" }}>
            <strong>Sunken</strong>
            <p style={{ color: "var(--color-text-secondary)" }}>Inset areas and wells</p>
          </div>
        </div>
      </Demo>

      <Demo title="Typography scale" description="Font-size tokens from 2xs through 2xl.">
        <p style={{ fontSize: "var(--font-size-2xs)" }}>2xs (10px)</p>
        <p style={{ fontSize: "var(--font-size-xs)" }}>xs (12px)</p>
        <p style={{ fontSize: "var(--font-size-sm)" }}>sm (14px)</p>
        <p style={{ fontSize: "var(--font-size-base)" }}>base (16px)</p>
        <p style={{ fontSize: "var(--font-size-lg)" }}>lg (18px)</p>
        <p style={{ fontSize: "var(--font-size-xl)" }}>xl (20px)</p>
        <p style={{ fontSize: "var(--font-size-2xl)" }}>2xl (24px)</p>
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
