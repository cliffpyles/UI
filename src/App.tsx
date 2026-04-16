import { useState } from "react";
import { ThemeProvider, useTheme } from "./providers";
import { DensityProvider, useDensity } from "./providers";
import { Text } from "./primitives/Text";
import { Box } from "./primitives/Box";
import { Icon } from "./primitives/Icon";
import { Divider } from "./primitives/Divider";
import { Badge } from "./primitives/Badge";
import { Dot } from "./primitives/Dot";
import { Spinner } from "./primitives/Spinner";
import { VisuallyHidden } from "./primitives/VisuallyHidden";
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

      <Divider spacing="6" />

      <section>
        <h2>Primitives</h2>

        <h3>Text</h3>
        <Box display="flex" direction="column" gap="2">
          <Text size="4xl" weight="bold">4xl Bold</Text>
          <Text size="2xl" weight="semibold">2xl Semibold</Text>
          <Text size="lg" weight="medium">lg Medium</Text>
          <Text size="base">base Normal</Text>
          <Text size="sm" color="secondary">sm Secondary</Text>
          <Text size="xs" color="tertiary">xs Tertiary</Text>
          <Text size="sm" family="mono" tabularNums>mono tabularNums: 1,234.56</Text>
          <Text truncate style={{ maxWidth: "200px" }}>
            This is a very long text that should be truncated with an ellipsis
          </Text>
          <Text size="sm" color="success">Success text</Text>
          <Text size="sm" color="warning">Warning text</Text>
          <Text size="sm" color="error">Error text</Text>
        </Box>

        <Divider spacing="4" />

        <h3>Box</h3>
        <Box display="flex" gap="3">
          <Box padding="4" background="surface" radius="md" shadow="sm">
            Surface + shadow-sm
          </Box>
          <Box padding="4" background="raised" radius="md" shadow="md">
            Raised + shadow-md
          </Box>
          <Box padding="4" background="sunken" radius="lg">
            Sunken + radius-lg
          </Box>
        </Box>

        <Divider spacing="4" />

        <h3>Icon</h3>
        <Box display="flex" gap="3" align="center">
          <Icon name="search" size="xs" />
          <Icon name="check" size="sm" />
          <Icon name="edit" size="md" />
          <Icon name="settings" size="lg" />
          <Icon name="user" size="xl" />
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Icon name="check" color="success" label="Success" />
          <Icon name="alert-triangle" color="warning" label="Warning" />
          <Icon name="alert-circle" color="error" label="Error" />
          <Icon name="info" color="info" label="Info" />
        </Box>

        <Divider spacing="4" />

        <h3>Badge</h3>
        <Box display="flex" gap="2" align="center">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Badge variant="neutral" size="sm">sm</Badge>
          <Badge variant="success" size="sm">sm</Badge>
        </Box>

        <Divider spacing="4" />

        <h3>Dot</h3>
        <Box display="flex" gap="4" align="center">
          <Box display="flex" gap="1" align="center">
            <Dot color="success" /><Text size="sm">Online</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="warning" /><Text size="sm">Away</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="error" /><Text size="sm">Offline</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="info" size="md" /><Text size="sm">Info (md)</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="neutral" /><Text size="sm">Neutral</Text>
          </Box>
        </Box>

        <Divider spacing="4" />

        <h3>Spinner</h3>
        <Box display="flex" gap="4" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Box>

        <Divider spacing="4" />

        <h3>VisuallyHidden</h3>
        <Box padding="2" background="raised" radius="md">
          <Text size="sm" color="secondary">
            There is a visually hidden element here:{" "}
            <VisuallyHidden>This text is only for screen readers</VisuallyHidden>
            (inspect the DOM to see it)
          </Text>
        </Box>
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
