import { useState } from "react";
import { ThemeProvider, useTheme } from "./providers";
import { DensityProvider, useDensity } from "./providers";
import "./App.css";

function Playground() {
  const [activeDensity, setActiveDensity] = useState<
    "compact" | "default" | "comfortable"
  >("default");

  return (
    <DensityProvider density={activeDensity}>
      <PlaygroundContent onDensityChange={setActiveDensity} />
    </DensityProvider>
  );
}

function PlaygroundContent({
  onDensityChange,
}: {
  onDensityChange: (d: "compact" | "default" | "comfortable") => void;
}) {
  const { theme, setTheme } = useTheme();
  const { density } = useDensity();

  return (
    <div className="playground">
      <h1>UI Component Library</h1>

      <div className="controls">
        <label>
          Theme:{" "}
          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "light" | "dark" | "system")
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Density:{" "}
          <select
            value={density}
            onChange={(e) =>
              onDensityChange(
                e.target.value as "compact" | "default" | "comfortable",
              )
            }
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
      </div>

      <section>
        <h2>Semantic Colors</h2>
        <h3>Status</h3>
        <div className="status-row">
          <span className="status-badge status-badge--success">Success</span>
          <span className="status-badge status-badge--warning">Warning</span>
          <span className="status-badge status-badge--error">Error</span>
          <span className="status-badge status-badge--info">Info</span>
        </div>
      </section>

      <section>
        <h2>Surfaces</h2>
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-content-gap)",
            flexWrap: "wrap",
          }}
        >
          <div className="token-demo">
            <strong>Raised</strong>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Cards and panels
            </p>
          </div>
          <div
            className="token-demo"
            style={{ background: "var(--color-background-surface-sunken)" }}
          >
            <strong>Sunken</strong>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Inset areas and wells
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Typography</h2>
        <p style={{ fontSize: "var(--font-size-2xs)" }}>2xs (10px)</p>
        <p style={{ fontSize: "var(--font-size-xs)" }}>xs (12px)</p>
        <p style={{ fontSize: "var(--font-size-sm)" }}>sm (14px)</p>
        <p style={{ fontSize: "var(--font-size-base)" }}>base (16px)</p>
        <p style={{ fontSize: "var(--font-size-lg)" }}>lg (18px)</p>
        <p style={{ fontSize: "var(--font-size-xl)" }}>xl (20px)</p>
        <p style={{ fontSize: "var(--font-size-2xl)" }}>2xl (24px)</p>
      </section>

      <section>
        <h2>Categorical Colors</h2>
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
      </section>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Playground />
    </ThemeProvider>
  );
}

export default App;
