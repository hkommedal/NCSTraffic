"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useMap, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { WeatherPoint } from "@/lib/schemas/met";

const REFRESH_INTERVAL = 600_000; // 10 minutes
const PARTICLES_PER_STATION = 30; // 20 grid pts × 30 = 600 total particles
const TRAIL_LENGTH = 14; // stored geo-positions per particle
const MIN_AGE = 60; // frames
const MAX_AGE = 240; // frames
const SPAWN_SPREAD_DEG = 1.0; // spawn radius around each station (degrees)
// Exaggerated visual speed — gives ~2 px/frame at zoom 8 for 10 m/s wind
const VISUAL_MPS = 8000;

// Wind speed → RGBA colour ramp (nullschool-style: blue → green → yellow → red)
function windColor(speed: number, alpha: number): string {
  let r: number, g: number, b: number;
  if (speed < 5) {
    const t = speed / 5;
    r = Math.round(40 + t * 20); g = Math.round(120 + t * 80); b = 230;
  } else if (speed < 10) {
    const t = (speed - 5) / 5;
    r = Math.round(60 + t * 60); g = Math.round(200 + t * 30); b = Math.round(230 - t * 130);
  } else if (speed < 15) {
    const t = (speed - 10) / 5;
    r = Math.round(120 + t * 135); g = 230; b = Math.round(100 - t * 100);
  } else if (speed < 20) {
    const t = (speed - 15) / 5;
    r = 255; g = Math.round(230 - t * 120); b = 0;
  } else {
    r = 255; g = Math.round(110 - Math.min(speed - 20, 10) * 8); b = 0;
  }
  return `rgba(${r},${g},${b},${alpha})`;
}

function windSolidColor(speed: number): string {
  return windColor(speed, 1);
}

type Particle = {
  lat: number;
  lon: number;
  trail: Array<[number, number]>; // [lat, lon] history — oldest first
  age: number;
  maxAge: number;
  stationIdx: number;
};

function makeParticle(stationIdx: number, baseLat: number, baseLon: number): Particle {
  const lat = baseLat + (Math.random() - 0.5) * 2 * SPAWN_SPREAD_DEG;
  const lon = baseLon + (Math.random() - 0.5) * 2 * SPAWN_SPREAD_DEG;
  return {
    lat, lon,
    trail: [[lat, lon]],
    age: Math.floor(Math.random() * MAX_AGE),
    maxAge: MIN_AGE + Math.floor(Math.random() * (MAX_AGE - MIN_AGE)),
    stationIdx,
  };
}

function WindCanvas({ weather }: { weather: WeatherPoint[] }) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const weatherRef = useRef(weather);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => { weatherRef.current = weather; }, [weather]);

  useEffect(() => {
    if (weather.length === 0) return;

    // Attach canvas directly to the map container so it is always top-left aligned
    const container = map.getContainer();
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;top:0;left:0;pointer-events:none;z-index:500;";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    function resize() {
      const s = map.getSize();
      canvas.width = s.x;
      canvas.height = s.y;
    }
    resize();

    // Spawn all particles with staggered ages so they don't all fade in at once
    particlesRef.current = [];
    for (let idx = 0; idx < weather.length; idx++) {
      const pt = weather[idx];
      for (let i = 0; i < PARTICLES_PER_STATION; i++) {
        particlesRef.current.push(makeParticle(idx, pt.lat, pt.lon));
      }
    }

    // Draw loop
    function draw(now: number) {
      // delta in fractional frames (cap at 3 to avoid big jumps after tab switches)
      const dt = Math.min((now - lastTimeRef.current) / 16.667, 3);
      lastTimeRef.current = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = weatherRef.current;

      for (const p of particlesRef.current) {
        const pt = pts[p.stationIdx];
        if (!pt) continue;

        // Direction wind blows TO (opposite of wind_from_direction)
        const toRad = ((pt.windDirection + 180) * Math.PI) / 180;
        const cosLat = Math.cos((p.lat * Math.PI) / 180);

        // Geo-step per frame: exaggerated for visual appeal
        const dLat = (Math.cos(toRad) * pt.windSpeed * VISUAL_MPS * dt) / (111320 * 60);
        const dLon = (Math.sin(toRad) * pt.windSpeed * VISUAL_MPS * dt) / (111320 * cosLat * 60);

        p.lat += dLat;
        p.lon += dLon;
        p.trail.push([p.lat, p.lon]);
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
        p.age += dt;

        // Respawn when lifetime exhausted or particle has drifted far from its station
        const driftLat = Math.abs(p.lat - pt.lat);
        const driftLon = Math.abs(p.lon - pt.lon);
        if (
          p.age >= p.maxAge ||
          driftLat > SPAWN_SPREAD_DEG * 3 ||
          driftLon > SPAWN_SPREAD_DEG * 3
        ) {
          Object.assign(p, makeParticle(p.stationIdx, pt.lat, pt.lon));
          continue;
        }

        if (p.trail.length < 2) continue;

        // Project each trail point to canvas pixel coordinates
        const px = p.trail.map(([lat, lon]) => {
          const cp = map.latLngToContainerPoint(L.latLng(lat, lon));
          return [cp.x, cp.y] as [number, number];
        });

        // Cull particles whose head is off-screen
        const head = px[px.length - 1];
        if (
          head[0] < -80 || head[0] > canvas.width + 80 ||
          head[1] < -80 || head[1] > canvas.height + 80
        ) {
          continue;
        }

        // Draw tapered, fading trail: segments nearer the head are brighter and wider
        const lifeAlpha = Math.sin((p.age / p.maxAge) * Math.PI);
        for (let i = 1; i < px.length; i++) {
          const segFrac = i / (px.length - 1);
          ctx.beginPath();
          ctx.moveTo(px[i - 1][0], px[i - 1][1]);
          ctx.lineTo(px[i][0], px[i][1]);
          ctx.strokeStyle = windColor(pt.windSpeed, segFrac * lifeAlpha * 0.88);
          ctx.lineWidth = 0.4 + segFrac * 1.7;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    map.on("resize", resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.off("resize", resize);
      canvas.remove();
      canvasRef.current = null;
    };
  }, [map, weather]);

  return null;
}

/** yr.no-style wind arrow: circle coloured by speed + rotating arrow */
function createWindIcon(windDirection: number, windSpeed: number): L.DivIcon {
  const size = 40;
  const color = windSolidColor(windSpeed);
  // Arrow points in the direction wind is GOING TO (from + 180)
  const toDir = (windDirection + 180) % 360;
  const speedLabel = windSpeed < 0.5 ? "calm" : `${windSpeed.toFixed(1)}`;

  return L.divIcon({
    className: "",
    iconSize: [size, size + 16],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <div style="
          width:${size}px;height:${size}px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(0,0,0,0.55);
          border:1.5px solid ${color};
          border-radius:50%;
          box-shadow:0 1px 6px rgba(0,0,0,0.5);
        ">
          <svg width="22" height="22" viewBox="0 0 22 22" style="transform:rotate(${toDir}deg);overflow:visible;">
            <!-- shaft -->
            <line x1="11" y1="17" x2="11" y2="5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            <!-- arrowhead -->
            <polyline points="7,9 11,4 15,9" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          </svg>
        </div>
        <span style="font-size:9px;font-weight:700;color:#fff;background:rgba(0,0,0,0.6);border-radius:3px;padding:0 3px;white-space:nowrap;">${speedLabel} m/s</span>
      </div>`,
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
      <WindCanvas weather={weather} />
      {weather.map((point) => (
        <Marker
          key={`${point.lat}-${point.lon}`}
          position={[point.lat, point.lon]}
          icon={createWindIcon(point.windDirection, point.windSpeed)}
          interactive={true}
          zIndexOffset={1000}
        >
          <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
            <div style={{ minWidth: 140 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>{point.label}</p>
              <p>🌡 {point.temperature.toFixed(1)} °C</p>
              <p>💨 {point.windSpeed.toFixed(1)} m/s from {point.windDirection.toFixed(0)}°</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
