import type { LatLngTuple } from "leaflet";

/**
 * Key airports and heliports serving the Norwegian Continental Shelf.
 * Keyed by IATA code (upper-case). Used to draw helicopter flight routes.
 */
export const AIRPORT_COORDS: Record<string, LatLngTuple> = {
  // Norway
  SVG: [58.8769, 5.6377],   // Stavanger / Sola
  BGO: [60.2934, 5.2181],   // Bergen / Flesland
  OSL: [60.1939, 11.1004],  // Oslo / Gardermoen
  TRD: [63.4578, 10.9239],  // Trondheim / Værnes
  FRO: [61.5836, 5.0247],   // Florø
  MOL: [62.7447, 7.2625],   // Molde / Ørsta-Volda
  AES: [62.5625, 6.1197],   // Ålesund / Vigra
  KSU: [63.1118, 7.8247],   // Kristiansund / Kvernberget
  HAU: [59.3453, 5.2086],   // Haugesund / Karmøy
  BOO: [67.2692, 14.3653],  // Bodø
  TOS: [69.6832, 18.9189],  // Tromsø

  // UK
  ABZ: [57.2019, -2.1978],  // Aberdeen / Dyce
  LWK: [60.1544, -1.2806],  // Lerwick / Tingwall (Shetland)
  LSI: [59.8787, -1.2956],  // Sumburgh (Shetland)
  WIC: [58.4589, -3.0928],  // Wick

  // Denmark
  BLL: [55.7402, 9.1518],   // Billund
  CPH: [55.6181, 12.6560],  // Copenhagen

  // Platform / offshore identifiers occasionally seen in FR24
  ENOP: [57.3500, 3.0000],  // Oseberg
  ENJS: [58.8500, 2.5500],  // Johan Sverdrup
};

export function airportCoords(code: string): LatLngTuple | null {
  return AIRPORT_COORDS[code?.toUpperCase()] ?? null;
}

/** Haversine distance in km between two lat/lon points. */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Codes of airports that serve as NCS helicopter bases.
 * Used to infer the likely origin of a helicopter when FR24 returns no origin/destination.
 */
const NCS_HELIPORT_CODES = ["SVG", "BGO", "ABZ", "LSI", "HAU", "FRO", "KSU", "BOO", "TRD", "AES"];

/**
 * Returns the [lat, lon] of the nearest NCS heliport to the given position.
 * Used as a fallback origin when FR24 origin/destination data is unavailable.
 */
export function nearestAirport(lat: number, lon: number): LatLngTuple {
  let best: LatLngTuple = AIRPORT_COORDS["SVG"];
  let bestDist = Infinity;
  for (const code of NCS_HELIPORT_CODES) {
    const coords = AIRPORT_COORDS[code];
    if (!coords) continue;
    const dist = haversineKm(lat, lon, coords[0], coords[1]);
    if (dist < bestDist) {
      bestDist = dist;
      best = coords;
    }
  }
  return best;
}
