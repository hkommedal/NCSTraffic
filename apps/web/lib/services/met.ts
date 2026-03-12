import type { WeatherPoint } from "@/lib/schemas/met";

const FORECAST_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const USER_AGENT = "NCSTraffic/1.0 github.com/NCSTraffic";

// 5-latitude × 4-longitude grid covering the North Sea / NCS area
const LATS = [57.0, 58.3, 59.6, 60.9, 62.2];
const LONS = [0.5, 2.0, 3.5, 5.0];

const WEATHER_GRID = LATS.flatMap((lat) =>
  LONS.map((lon) => ({ lat, lon, label: `${lat}°N ${lon}°E` })),
);

async function fetchWeatherForPoint(
  lat: number,
  lon: number,
  label: string,
): Promise<WeatherPoint> {
  const url = `${FORECAST_URL}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Met API failed for ${label}: ${response.status}`);
  }

  const data = await response.json();
  const timeseries = data?.properties?.timeseries;

  if (!timeseries || timeseries.length === 0) {
    throw new Error(`No weather data for ${label}`);
  }

  const current = timeseries[0];
  const instant = current.data?.instant?.details;
  const symbolCode =
    current.data?.next_1_hours?.summary?.symbol_code ??
    current.data?.next_6_hours?.summary?.symbol_code ??
    "unknown";

  return {
    lat,
    lon,
    temperature: instant?.air_temperature ?? 0,
    windSpeed: instant?.wind_speed ?? 0,
    windDirection: instant?.wind_from_direction ?? 0,
    symbolCode,
    label,
  };
}

export async function fetchWeatherGrid(): Promise<WeatherPoint[]> {
  const results = await Promise.allSettled(
    WEATHER_GRID.map((point) => fetchWeatherForPoint(point.lat, point.lon, point.label)),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<WeatherPoint> => r.status === "fulfilled")
    .map((r) => r.value);
}
