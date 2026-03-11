"use client";

import { useEffect, useState, useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { WeatherPoint } from "@/lib/schemas/met";
import { getWeatherDisplay } from "@/lib/data/weather-icons";

const REFRESH_INTERVAL = 600_000; // 10 minutes

function createWeatherIcon(symbolCode: string, temperature: number) {
  const { emoji } = getWeatherDisplay(symbolCode);
  return L.divIcon({
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
        <span style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${emoji}</span>
        <span style="font-size:11px;font-weight:700;color:#333;background:rgba(255,255,255,0.85);border-radius:4px;padding:0 3px;margin-top:1px;">${Math.round(temperature)}&deg;</span>
      </div>
    `,
  });
}

export default function WeatherLayer() {
  const [weather, setWeather] = useState<WeatherPoint[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) return;
      const data = await res.json();
      setWeather(data);
    } catch {
      // Keep showing last data on error
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <>
      {weather.map((point) => (
        <Marker
          key={`${point.lat}-${point.lon}`}
          position={[point.lat, point.lon]}
          icon={createWeatherIcon(point.symbolCode, point.temperature)}
          interactive={true}
        >
          <Tooltip>
            <div className="text-sm">
              <p className="font-bold">{point.label}</p>
              <p>{getWeatherDisplay(point.symbolCode).label}</p>
              <p>Temp: {point.temperature.toFixed(1)}°C</p>
              <p>Wind: {point.windSpeed.toFixed(1)} m/s</p>
              <p>Wind dir: {point.windDirection.toFixed(0)}°</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
