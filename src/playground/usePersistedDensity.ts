import { useEffect, useState } from "react";

type Density = "compact" | "default" | "comfortable";
const STORAGE_KEY = "playground:density";

function isDensity(v: string | null): v is Density {
  return v === "compact" || v === "default" || v === "comfortable";
}

export function usePersistedDensity(): [Density, (d: Density) => void] {
  const [density, setDensity] = useState<Density>(() => {
    if (typeof window === "undefined") return "default";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isDensity(stored) ? stored : "default";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, density);
  }, [density]);

  return [density, setDensity];
}
