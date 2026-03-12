// Server-side in-memory registry tracking the last successful fetch time for each datasource.
// Updated by API route handlers; read by /api/datasources.

export type DatasourceKey = "flights" | "vessels" | "weather" | "ocean";

type DatasourceInfo = {
  name: string;
  description: string;
  url: string;
  lastFetchedAt: Date | null;
  error: string | null;
};

type Registry = Record<DatasourceKey, DatasourceInfo>;

// globalThis ensures a single instance across hot-reloads in dev
const g = globalThis as typeof globalThis & { __datasourceRegistry?: Registry };

if (!g.__datasourceRegistry) {
  g.__datasourceRegistry = {
    flights: {
      name: "FlightRadar24",
      description: "Live helicopter and fixed-wing traffic over the Norwegian Continental Shelf",
      url: "https://data-cloud.flightradar24.com",
      lastFetchedAt: null,
      error: null,
    },
    vessels: {
      name: "BarentsWatch AIS",
      description: "Real-time AIS vessel positions from the Norwegian Coastal Administration",
      url: "https://live.ais.barentswatch.no",
      lastFetchedAt: null,
      error: null,
    },
    weather: {
      name: "MET Norway",
      description: "Gridded weather forecast data for the North Sea from the Norwegian Meteorological Institute",
      url: "https://api.met.no",
      lastFetchedAt: null,
      error: null,
    },
    ocean: {
      name: "MET Norway — Ocean Forecast",
      description: "Gridded sea wave height, direction and period forecast for the North Sea",
      url: "https://api.met.no",
      lastFetchedAt: null,
      error: null,
    },
  };
}

const registry = g.__datasourceRegistry;

export function recordFetch(key: DatasourceKey, error?: string) {
  registry[key].lastFetchedAt = new Date();
  registry[key].error = error ?? null;
}

export function getRegistry(): Registry {
  return registry;
}
