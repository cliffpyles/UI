import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export type SectionId =
  | "overview"
  | "primitives"
  | "base"
  | "composite"
  | "data-display"
  | "domain"
  | "layouts"
  | "advanced";

export interface SectionDef {
  id: SectionId;
  label: string;
  group: string;
  Component: LazyExoticComponent<ComponentType>;
}

export const SECTIONS: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    group: "Foundations",
    Component: lazy(() => import("./sections/Overview")),
  },
  {
    id: "primitives",
    label: "Primitives",
    group: "Foundations",
    Component: lazy(() => import("./sections/Primitives")),
  },
  {
    id: "base",
    label: "Base",
    group: "Components",
    Component: lazy(() => import("./sections/BaseComponents")),
  },
  {
    id: "composite",
    label: "Composite",
    group: "Components",
    Component: lazy(() => import("./sections/CompositeComponents")),
  },
  {
    id: "data-display",
    label: "Data Display",
    group: "Components",
    Component: lazy(() => import("./sections/DataDisplay")),
  },
  {
    id: "domain",
    label: "Domain",
    group: "Higher-level",
    Component: lazy(() => import("./sections/Domain")),
  },
  {
    id: "layouts",
    label: "Layouts",
    group: "Higher-level",
    Component: lazy(() => import("./sections/Layouts")),
  },
  {
    id: "advanced",
    label: "Advanced",
    group: "Higher-level",
    Component: lazy(() => import("./sections/Advanced")),
  },
];

export const DEFAULT_SECTION: SectionId = "overview";

export function isSectionId(id: string): id is SectionId {
  return SECTIONS.some((s) => s.id === id);
}
