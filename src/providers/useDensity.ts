import { useContext } from "react";
import { DensityContext } from "./DensityContext";

export function useDensity() {
  const ctx = useContext(DensityContext);
  if (!ctx) throw new Error("useDensity must be used within a DensityProvider");
  return ctx;
}
