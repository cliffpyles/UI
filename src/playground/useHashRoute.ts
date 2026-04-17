import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SECTION, isSectionId, type SectionId } from "./sections";

function readHash(): SectionId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return isSectionId(raw) ? raw : DEFAULT_SECTION;
}

export function useHashRoute(): [SectionId, (id: SectionId) => void] {
  const [section, setSection] = useState<SectionId>(() =>
    typeof window === "undefined" ? DEFAULT_SECTION : readHash(),
  );

  useEffect(() => {
    const onChange = () => setSection(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((id: SectionId) => {
    if (window.location.hash !== `#/${id}`) {
      window.location.hash = `/${id}`;
    }
  }, []);

  return [section, navigate];
}
