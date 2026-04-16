import { createContext } from "react";

type Density = "compact" | "default" | "comfortable";

export interface DensityContextValue {
  density: Density;
  setDensity: (density: Density) => void;
}

export const DensityContext = createContext<DensityContextValue | null>(null);
