import type { LatLngTuple } from "leaflet";

type Facility = {
  name: string;
  type: "processing" | "drilling" | "wellhead" | "quarters" | "template";
  position: LatLngTuple;
  description: string;
  operator: string;
  startYear: number;
};

/**
 * Troll field boundary polygon from Sodir FactMaps GIS API.
 * The Troll field is one of the largest gas fields on the NCS, covering a large area
 * west of Bergen. Coordinates in [lat, lng] format for Leaflet.
 */
export const trollPolygon: LatLngTuple[] = [
  [60.974, 3.625],
  [60.963, 3.618],
  [60.947, 3.586],
  [60.924, 3.51],
  [60.908, 3.554],
  [60.892, 3.572],
  [60.866, 3.579],
  [60.904, 3.537],
  [60.905, 3.52],
  [60.891, 3.51],
  [60.886, 3.492],
  [60.9, 3.464],
  [60.898, 3.447],
  [60.892, 3.443],
  [60.882, 3.457],
  [60.889, 3.437],
  [60.875, 3.421],
  [60.851, 3.409],
  [60.819, 3.413],
  [60.814, 3.421],
  [60.795, 3.408],
  [60.752, 3.407],
  [60.733, 3.441],
  [60.764, 3.46],
  [60.777, 3.444],
  [60.769, 3.462],
  [60.773, 3.48],
  [60.806, 3.426],
  [60.812, 3.431],
  [60.791, 3.459],
  [60.798, 3.47],
  [60.772, 3.512],
  [60.776, 3.519],
  [60.801, 3.48],
  [60.802, 3.463],
  [60.828, 3.425],
  [60.827, 3.44],
  [60.841, 3.422],
  [60.839, 3.446],
  [60.828, 3.466],
  [60.847, 3.479],
  [60.815, 3.519],
  [60.798, 3.526],
  [60.777, 3.526],
  [60.762, 3.509],
  [60.719, 3.488],
  [60.695, 3.445],
  [60.679, 3.454],
  [60.672, 3.445],
  [60.706, 3.54],
  [60.713, 3.529],
  [60.712, 3.581],
  [60.732, 3.615],
  [60.723, 3.639],
  [60.694, 3.667],
  [60.7, 3.68],
  [60.715, 3.682],
  [60.739, 3.658],
  [60.74, 3.641],
  [60.748, 3.644],
  [60.773, 3.621],
  [60.765, 3.642],
  [60.77, 3.644],
  [60.801, 3.611],
  [60.793, 3.633],
  [60.817, 3.601],
  [60.822, 3.611],
  [60.81, 3.691],
  [60.824, 3.655],
  [60.829, 3.652],
  [60.826, 3.663],
  [60.88, 3.595],
  [60.883, 3.616],
  [60.899, 3.603],
  [60.902, 3.611],
  [60.913, 3.601],
  [60.916, 3.609],
  [60.878, 3.646],
  [60.875, 3.669],
  [60.843, 3.692],
  [60.826, 3.702],
  [60.814, 3.693],
  [60.795, 3.695],
  [60.717, 3.748],
  [60.692, 3.728],
  [60.665, 3.681],
  [60.617, 3.636],
  [60.606, 3.614],
  [60.585, 3.606],
  [60.556, 3.628],
  [60.519, 3.635],
  [60.519, 3.665],
  [60.548, 3.714],
  [60.562, 3.755],
  [60.563, 3.784],
  [60.502, 3.908],
  [60.559, 3.912],
  [60.59, 3.931],
  [60.612, 3.929],
  [60.625, 3.938],
  [60.651, 3.923],
  [60.661, 3.927],
  [60.679, 3.952],
  [60.685, 4.001],
  [60.695, 4.004],
  [60.754, 3.874],
  [60.782, 3.842],
  [60.801, 3.776],
  [60.838, 3.746],
  [60.858, 3.698],
  [60.869, 3.688],
  [60.865, 3.712],
  [60.902, 3.664],
  [60.916, 3.662],
  [60.919, 3.674],
  [60.94, 3.636],
  [60.957, 3.623],
  [60.941, 3.663],
  [60.961, 3.657],
  [60.974, 3.625],
];

/** Center point (centroid) of the Troll field. */
export const trollCenter: LatLngTuple = [60.74, 3.60];

/** Troll field metadata. */
export const trollField = {
  name: "Troll",
  operator: "Equinor",
  status: "Producing",
  discoveryYear: 1979,
  productionStart: 1995,
  waterDepthM: "300–330",
  hcType: "Gas and oil",
  description:
    "One of the largest gas fields in the world. Located west of Bergen in the " +
    "North Sea, Troll provides a significant share of Norway's gas exports to Europe.",
} as const;

/** Facilities on the Troll field.
 * Coordinates sourced from Sodir FactPages.
 */
export const trollFacilities: Facility[] = [
  {
    name: "Troll A",
    type: "processing",
    position: [60.6453, 3.6263],
    description:
      "Gas production platform — the tallest structure ever moved by mankind " +
      "with a concrete base reaching 303 m from the seabed.",
    operator: "Equinor",
    startYear: 1995,
  },
  {
    name: "Troll B",
    type: "processing",
    position: [60.7753, 3.4997],
    description: "Semi-submersible floating platform producing oil from the Troll West oil province.",
    operator: "Equinor",
    startYear: 1995,
  },
  {
    name: "Troll C",
    type: "processing",
    position: [60.8886, 3.6142],
    description: "Semi-submersible floating platform producing oil from the Troll West gas province.",
    operator: "Equinor",
    startYear: 1999,
  },
  {
    name: "Troll — Subsea Template West",
    type: "template",
    position: [60.760, 3.420],
    description: "Subsea template tied back to the Troll B platform.",
    operator: "Equinor",
    startYear: 1995,
  },
  {
    name: "Troll — Subsea Template East",
    type: "template",
    position: [60.700, 3.580],
    description: "Subsea template tied back to the Troll A platform.",
    operator: "Equinor",
    startYear: 1995,
  },
];
