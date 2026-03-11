import type { LatLngTuple } from "leaflet";

type Facility = {
  name: string;
  type: "platform" | "fpso" | "subsea";
  position: LatLngTuple;
  description: string;
  operator: string;
  startYear: number;
};

/**
 * Johan Sverdrup field boundary polygon (approximate, based on Sodir public data).
 * Coordinates in [lat, lng] format for Leaflet.
 */
export const johanSverdrupPolygon: LatLngTuple[] = [
  [58.985, 2.385],
  [58.99, 2.43],
  [58.988, 2.49],
  [58.975, 2.535],
  [58.955, 2.565],
  [58.935, 2.575],
  [58.91, 2.57],
  [58.89, 2.555],
  [58.875, 2.525],
  [58.865, 2.485],
  [58.862, 2.44],
  [58.865, 2.395],
  [58.875, 2.36],
  [58.895, 2.34],
  [58.92, 2.33],
  [58.945, 2.34],
  [58.965, 2.355],
  [58.985, 2.385],
];

/** Center point of the Johan Sverdrup field. */
export const johanSverdrupCenter: LatLngTuple = [58.925, 2.455];

/** Johan Sverdrup field metadata. */
export const johanSverdrupField = {
  name: "Johan Sverdrup",
  operator: "Equinor",
  status: "Producing",
  discoveryYear: 2010,
  productionStart: 2019,
  phase2Start: 2022,
  areaKm2: 200,
  waterDepthM: "110–120",
  description:
    "One of the largest oil fields on the Norwegian Continental Shelf. " +
    "Located in the North Sea, west of Stavanger.",
} as const;

/** Facilities on the Johan Sverdrup field. */
export const johanSverdrupFacilities: Facility[] = [
  {
    name: "Field Centre — Process Platform (P1)",
    type: "platform",
    position: [58.926, 2.455],
    description: "Main processing platform handling oil, gas, and water separation (Phase 1).",
    operator: "Equinor",
    startYear: 2019,
  },
  {
    name: "Riser Platform (RP)",
    type: "platform",
    position: [58.924, 2.45],
    description: "Receives well streams from subsea templates and routes to processing.",
    operator: "Equinor",
    startYear: 2019,
  },
  {
    name: "Drilling Platform (DP)",
    type: "platform",
    position: [58.928, 2.46],
    description: "Drilling platform for production and injection wells.",
    operator: "Equinor",
    startYear: 2019,
  },
  {
    name: "Living Quarters (LQ)",
    type: "platform",
    position: [58.923, 2.445],
    description: "Accommodation and utility platform for field personnel.",
    operator: "Equinor",
    startYear: 2019,
  },
  {
    name: "P2 Processing Platform (Phase 2)",
    type: "platform",
    position: [58.93, 2.465],
    description: "Second processing platform added in Phase 2, increasing capacity to 755,000 boe/d.",
    operator: "Equinor",
    startYear: 2022,
  },
];
