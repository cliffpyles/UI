import { Suspense, useState } from "react";
import { DensityProvider } from "../providers";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SECTIONS } from "./sections";
import { useHashRoute } from "./useHashRoute";
import "../App.css";
import "./Playground.css";

function Playground() {
  const [density, setDensity] = useState<"compact" | "default" | "comfortable">("default");
  const [sectionId, navigate] = useHashRoute();
  const active = SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0];
  const ActiveSection = active.Component;

  return (
    <DensityProvider density={density}>
      <div className="pg-shell">
        <Sidebar active={active.id} onNavigate={navigate} />
        <div className="pg-main">
          <Header onDensityChange={setDensity} />
          <div className="playground pg-content">
            <Suspense fallback={<div className="pg-fallback">Loading {active.label}…</div>}>
              <ActiveSection key={active.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </DensityProvider>
  );
}

export default Playground;
