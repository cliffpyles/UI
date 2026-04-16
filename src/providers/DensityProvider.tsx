import { useCallback, useMemo, useState, type ReactNode } from "react";
import { DensityContext } from "./DensityContext";

type Density = "compact" | "default" | "comfortable";

export interface DensityProviderProps {
  children: ReactNode;
  density?: Density;
}

export function DensityProvider({ children, density: controlledDensity }: DensityProviderProps) {
  const [uncontrolledDensity, setUncontrolledDensity] = useState<Density>("default");

  const density = controlledDensity ?? uncontrolledDensity;

  const setDensity = useCallback((newDensity: Density) => {
    setUncontrolledDensity(newDensity);
  }, []);

  const value = useMemo(() => ({ density, setDensity }), [density, setDensity]);

  return (
    <DensityContext value={value}>
      <div data-density={density}>
        {children}
      </div>
    </DensityContext>
  );
}
