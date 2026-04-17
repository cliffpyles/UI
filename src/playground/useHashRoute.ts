import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SECTION, isSectionId, type SectionId } from "./sections";

const STORAGE_KEY = "playground:last-section";

function readHash(): SectionId | null {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return isSectionId(raw) ? raw : null;
}

function initial(): SectionId {
  if (typeof window === "undefined") return DEFAULT_SECTION;
  const fromHash = readHash();
  if (fromHash) return fromHash;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && isSectionId(stored)) return stored;
  return DEFAULT_SECTION;
}

export function useHashRoute(): [SectionId, (id: SectionId) => void] {
  const [section, setSection] = useState<SectionId>(initial);

  useEffect(() => {
    if (!readHash()) {
      window.history.replaceState(null, "", `#/${section}`);
    }
  }, [section]);

  useEffect(() => {
    const onChange = () => {
      const next = readHash();
      if (next) setSection(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, section);
  }, [section]);

  const navigate = useCallback((id: SectionId) => {
    if (window.location.hash !== `#/${id}`) {
      window.location.hash = `/${id}`;
    }
  }, []);

  return [section, navigate];
}
