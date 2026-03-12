import type { Flight } from "@/lib/schemas/flightradar";

const FEED_URL = "https://data-cloud.flightradar24.com/zones/fcgi/feed.js";
const DETAIL_URL = "https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=";

/**
 * Fetch origin/destination for a single flight from FR24's clickhandler API.
 * Returns ICAO codes, or empty strings if unavailable.
 */
export async function fetchFlightRoute(
  flightId: string,
): Promise<{ origin: string; destination: string; originName: string; destinationName: string }> {
  try {
    const res = await fetch(`${DETAIL_URL}${flightId}`, { next: { revalidate: 120 } });
    if (!res.ok) return { origin: "", destination: "", originName: "", destinationName: "" };
    const data = (await res.json()) as Record<string, unknown>;
    const airport = (data.airport ?? {}) as Record<string, unknown>;
    const orig = (airport.origin ?? {}) as Record<string, unknown>;
    const dest = (airport.destination ?? {}) as Record<string, unknown>;
    const origCode = ((orig.code ?? {}) as Record<string, unknown>).icao as string | undefined;
    const destCode = ((dest.code ?? {}) as Record<string, unknown>).icao as string | undefined;
    return {
      origin: origCode ?? "",
      destination: destCode ?? "",
      originName: (orig.name as string | undefined) ?? "",
      destinationName: (dest.name as string | undefined) ?? "",
    };
  } catch {
    return { origin: "", destination: "", originName: "", destinationName: "" };
  }
}

/**
 * Split the North Sea into smaller sub-regions to avoid FR24's free-tier
 * result-count limit for large bounding boxes.
 * Format per FR24: "north,south,west,east"
 */
const SUB_BOUNDS = [
  "59.25,56,-2,3",
  "59.25,56,3,8",
  "62.5,59.25,-2,3",
  "62.5,59.25,3,8",
];

const HELICOPTER_TYPES = new Set([
  "S92",
  "S76",
  "AS32",
  "A169",
  "AS3B",
  "EC55",
  "EC35",
  "A139",
  "AW39",
  "H160",
  "H175",
  "EC75",
  "B06",
  "B12",
  "B212",
  "B412",
  "R22",
  "R44",
  "R66",
  "EC30",
  "EC45",
  "A109",
  "NH90",
  "S61",
  "H215",
  "H225",
  "AS65",
  "EC20",
  "BK17",
  "LYNX",
  "EH10",
]);

export async function fetchFlights(): Promise<Flight[]> {
  const headers: HeadersInit = {};
  const token = process.env.FLIGHTRADAR24_ACCESS_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseParams = {
    faa: "1",
    satellite: "1",
    mlat: "1",
    flarm: "1",
    adsb: "1",
    gnd: "0",
    air: "1",
    vehicles: "0",
    estimated: "0",
    maxage: "14400",
    gliders: "0",
    stats: "0",
  };

  const results = await Promise.allSettled(
    SUB_BOUNDS.map(async (bounds) => {
      const params = new URLSearchParams({ ...baseParams, bounds });
      const response = await fetch(`${FEED_URL}?${params}`, { headers });
      if (!response.ok) throw new Error(`FR24 API failed: ${response.status}`);
      return response.json() as Promise<Record<string, unknown>>;
    }),
  );

  const seen = new Set<string>();
  const flights: Flight[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const [key, value] of Object.entries(result.value)) {
      if (!Array.isArray(value) || value.length < 18) continue;
      if (seen.has(key)) continue;
      seen.add(key);

      const lat = Number(value[1]);
      const lon = Number(value[2]);
      if (lat === 0 && lon === 0) continue;

      const aircraftType = String(value[8] ?? "");

      flights.push({
        id: key,
        icao24: String(value[0] ?? ""),
        latitude: lat,
        longitude: lon,
        heading: Number(value[3]),
        altitude: Number(value[4]),
        groundSpeed: Number(value[5]),
        aircraftType,
        registration: String(value[9] ?? ""),
        origin: String(value[11] ?? ""),
        destination: String(value[12] ?? ""),
        originName: "",
        destinationName: "",
        flightNumber: String(value[13] ?? ""),
        callsign: String(value[16] ?? ""),
        verticalSpeed: Number(value[15] ?? 0),
        isHelicopter: HELICOPTER_TYPES.has(aircraftType.toUpperCase()),
      });
    }
  }

  return flights;
}
