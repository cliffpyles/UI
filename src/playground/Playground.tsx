import { Suspense, useEffect } from "react";
import { DensityProvider } from "../providers";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SectionErrorBoundary } from "./components/ErrorBoundary";
import { TableOfContents } from "./components/TableOfContents";
import { SECTIONS } from "./sections";
import { useHashRoute } from "./useHashRoute";
import { usePersistedDensity } from "./usePersistedDensity";
import "../App.css";
import "./Playground.css";

const SECTION_ROOT_SELECTOR = "#pg-section-root";

function Playground() {
  const [density, setDensity] = usePersistedDensity();
  const [sectionId, navigate] = useHashRoute();
  const active = SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0];
  const ActiveSection = active.Component;

  useEffect(() => {
    document.title = `${active.label} · UI Playground`;
  }, [active.label]);

  return (
    <DensityProvider density={density}>
      <div className="pg-shell">
        <Sidebar active={active.id} onNavigate={navigate} />
        <div className="pg-main">
          <Header onDensityChange={setDensity} />
          <div className="pg-body">
            <div className="playground pg-content" id="pg-section-root">
              <SectionErrorBoundary sectionLabel={active.label}>
                <Suspense fallback={<div className="pg-fallback">Loading {active.label}…</div>}>
                  <ActiveSection key={active.id} />
                </Suspense>
              </SectionErrorBoundary>
            </div>
            <TableOfContents containerSelector={SECTION_ROOT_SELECTOR} sectionKey={active.id} />
          </div>
        </div>
      </div>
    </DensityProvider>
  );
}

export default Playground;
