import type { WeatherPoint } from "@/lib/schemas/met";

const FORECAST_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const USER_AGENT = "NCSTraffic/1.0 github.com/NCSTraffic";

// Grid of weather observation points across the North Sea
const WEATHER_GRID = [
  { lat: 57.0, lon: 2.0, label: "Southern North Sea" },
  { lat: 58.0, lon: 0.0, label: "Central North Sea W" },
  { lat: 58.0, lon: 3.0, label: "Central North Sea" },
  { lat: 58.0, lon: 6.0, label: "Central North Sea E" },
  { lat: 58.9, lon: 2.5, label: "Johan Sverdrup" },
  { lat: 59.5, lon: 1.0, label: "Northern North Sea W" },
  { lat: 59.5, lon: 4.5, label: "Northern North Sea" },
  { lat: 60.5, lon: 2.0, label: "Norwegian Sea S" },
  { lat: 60.5, lon: 5.0, label: "Bergen Sea" },
  { lat: 61.5, lon: 3.0, label: "Norwegian Sea N" },
] as const;

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
