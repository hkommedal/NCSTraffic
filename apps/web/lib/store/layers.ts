import { create } from "zustand";

export type FacilityType = "processing" | "drilling" | "riser" | "quarters" | "wellhead" | "template";

export const FACILITY_TYPES: { type: FacilityType; label: string; color: string }[] = [
  { type: "processing", label: "Processing", color: "#c62828" },
  { type: "drilling", label: "Drilling", color: "#e65100" },
  { type: "riser", label: "Riser", color: "#6a1b9a" },
  { type: "quarters", label: "Quarters", color: "#1565c0" },
  { type: "wellhead", label: "Wellhead", color: "#2e7d32" },
  { type: "template", label: "Template", color: "#00695c" },
];

type LayerStore = {
  johanSverdrup: boolean;
  brage: boolean;
  facilityTypes: Record<FacilityType, boolean>;
  vessels: boolean;
  flights: boolean;
  helicopterRoutes: boolean;
  airports: boolean;
  weather: boolean;
  waves: boolean;
  toggle: (layer: "johanSverdrup" | "brage" | "vessels" | "flights" | "helicopterRoutes" | "airports" | "weather" | "waves") => void;
  toggleFacilityType: (type: FacilityType) => void;
};

const allTypesOn = Object.fromEntries(
  FACILITY_TYPES.map((f) => [f.type, true]),
) as Record<FacilityType, boolean>;

export const useLayerStore = create<LayerStore>()((set) => ({
  johanSverdrup: true,
  brage: true,
  facilityTypes: allTypesOn,
  vessels: true,
  flights: true,
  helicopterRoutes: true,
  airports: true,
  weather: false,
  waves: false,
  toggle: (layer) => set((state) => ({ [layer]: !state[layer] })),
  toggleFacilityType: (type) =>
    set((state) => ({
      facilityTypes: { ...state.facilityTypes, [type]: !state.facilityTypes[type] },
    })),
}));
