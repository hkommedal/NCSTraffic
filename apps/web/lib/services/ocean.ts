import type { WavePoint } from "@/lib/schemas/ocean";

const OCEAN_URL = "https://api.met.no/weatherapi/oceanforecast/2.0/complete";
const USER_AGENT = "NCSTraffic/1.0 github.com/NCSTraffic";

// 4×5 grid covering the North Sea / NCS
const LATS = [57.0, 58.3, 59.6, 60.9, 62.2];
const LONS = [0.5, 2.0, 3.5, 5.0];

const OCEAN_GRID = LATS.flatMap((lat) =>
  LONS.map((lon) => ({ lat, lon, label: `${lat}°N ${lon}°E` })),
);

async function fetchOceanForPoint(lat: number, lon: number, label: string): Promise<WavePoint> {
  const url = `${OCEAN_URL}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

  if (!res.ok) throw new Error(`Ocean API failed for ${label}: ${res.status}`);

  const data = await res.json();
  const timeseries = data?.properties?.timeseries;
  if (!timeseries?.length) throw new Error(`No ocean data for ${label}`);

  const current = timeseries[0].data?.instant?.details ?? {};

  return {
    lat,
    lon,
    label,
    waveHeight: current.sea_surface_wave_height ?? 0,
    waveDirection: current.sea_surface_wave_from_direction ?? 0,
    wavePeriod: current.sea_surface_wave_period_at_variance_spectral_density_maximum ?? 0,
  };
}

export async function fetchOceanGrid(): Promise<WavePoint[]> {
  const results = await Promise.allSettled(
    OCEAN_GRID.map((pt) => fetchOceanForPoint(pt.lat, pt.lon, pt.label)),
  );
  return results
    .filter((r): r is PromiseFulfilledResult<WavePoint> => r.status === "fulfilled")
    .map((r) => r.value);
}
