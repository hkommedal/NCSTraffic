import type { LatLngTuple } from "leaflet";

type Facility = {
  name: string;
  type: "processing" | "drilling" | "wellhead" | "quarters" | "riser" | "template";
  position: LatLngTuple;
  description: string;
  operator: string;
  startYear: number;
};

/**
 * Ekofisk field boundary polygon from Sodir FactMaps GIS API.
 * Coordinates in [lat, lng] format for Leaflet.
 */
export const ekofiskPolygon: LatLngTuple[] = [
  [56.4929, 3.2295],
  [56.4963, 3.2371],
  [56.5028, 3.2421],
  [56.5507, 3.2558],
  [56.5622, 3.256],
  [56.5763, 3.2502],
  [56.5842, 3.2135],
  [56.5824, 3.1862],
  [56.5768, 3.1759],
  [56.5682, 3.1691],
  [56.544, 3.1787],
  [56.5122, 3.2024],
  [56.4929, 3.2295],
];

/** Center point (centroid) of the Ekofisk field. */
export const ekofiskCenter: LatLngTuple = [56.54, 3.215];

/** Ekofisk field metadata. */
export const ekofiskField = {
  name: "Ekofisk",
  operator: "ConocoPhillips",
  status: "Producing",
  discoveryYear: 1969,
  productionStart: 1971,
  waterDepthM: "70–75",
  hcType: "Oil and gas",
  description:
    "The first major oil field discovered on the Norwegian Continental Shelf. " +
    "Located in the southern North Sea, it has been in continuous production since 1971.",
} as const;

/** Facilities on the Ekofisk field.
 * Coordinates sourced from Sodir FactPages.
 */
export const ekofiskFacilities: Facility[] = [
  {
    name: "Ekofisk 2/4-L (Complex)",
    type: "processing",
    position: [56.5443, 3.2113],
    description: "Main processing and accommodation complex rebuilt in the 1990s.",
    operator: "ConocoPhillips",
    startYear: 1998,
  },
  {
    name: "Ekofisk 2/4-Z",
    type: "processing",
    position: [56.5433, 3.2150],
    description: "Processing platform handling water injection support.",
    operator: "ConocoPhillips",
    startYear: 2013,
  },
  {
    name: "Ekofisk 2/4-X",
    type: "wellhead",
    position: [56.5453, 3.2080],
    description: "Wellhead platform for production wells.",
    operator: "ConocoPhillips",
    startYear: 1996,
  },
  {
    name: "Ekofisk 2/4-J",
    type: "quarters",
    position: [56.5440, 3.2170],
    description: "Accommodation platform for field personnel.",
    operator: "ConocoPhillips",
    startYear: 1998,
  },
  {
    name: "Ekofisk 2/4-VB",
    type: "wellhead",
    position: [56.5490, 3.2040],
    description: "Satellite wellhead platform in the Ekofisk complex.",
    operator: "ConocoPhillips",
    startYear: 2013,
  },
  {
    name: "Ekofisk 2/4-B",
    type: "drilling",
    position: [56.5420, 3.2095],
    description: "Drilling and well services platform.",
    operator: "ConocoPhillips",
    startYear: 1974,
  },
];
