import { useTheme } from "../../providers";
import { useDensity } from "../../providers";
import { Text } from "../../primitives/Text";

interface HeaderProps {
  onDensityChange: (d: "compact" | "default" | "comfortable") => void;
}

export function Header({ onDensityChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { density } = useDensity();

  return (
    <header className="pg-header">
      <Text as="h1" className="pg-header__title" size="xl" weight="bold">UI Component Library</Text>
      <div className="pg-header__controls">
        <label>
          Theme:{" "}
          <select value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Density:{" "}
          <select
            value={density}
            onChange={(e) => onDensityChange(e.target.value as "compact" | "default" | "comfortable")}
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
      </div>
    </header>
  );
}
