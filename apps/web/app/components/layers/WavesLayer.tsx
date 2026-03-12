"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useMap, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { WavePoint } from "@/lib/schemas/ocean";

const REFRESH_INTERVAL = 600_000; // 10 minutes
const DROPS_PER_STATION = 28;
const TRAIL_LENGTH = 8; // stored geo positions per drop
const SPAWN_SPREAD_DEG = 0.9;
const MIN_AGE = 50;
const MAX_AGE = 200;
// Exaggerated visual speed — gives ~1.5 px/frame at zoom 8 for 2 m wave height
const VISUAL_MPS = 6500;
const DROP_RADIUS = 2.8; // head dot radius in px

// Blue palette: calm light blue → intense deep blue as wave height grows
function dropColor(height: number, alpha: number): string {
  const t = Math.min(height / 6, 1);
  const r = Math.round(30 + t * 10);
  const g = Math.round(150 - t * 60);
  const b = Math.round(255 - t * 40);
  return `rgba(${r},${g},${b},${alpha})`;
}

function waveSolidColor(height: number): string {
  return dropColor(height, 1);
}

type Drop = {
  lat: number;
  lon: number;
  trail: Array<[number, number]>;
  age: number;
  maxAge: number;
  stationIdx: number;
};

function makeDrop(stationIdx: number, baseLat: number, baseLon: number): Drop {
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

function WavesCanvas({ waves }: { waves: WavePoint[] }) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropsRef = useRef<Drop[]>([]);
  const rafRef = useRef<number | null>(null);
  const wavesRef = useRef(waves);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => { wavesRef.current = waves; }, [waves]);

  useEffect(() => {
    if (waves.length === 0) return;

    const container = map.getContainer();
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;top:0;left:0;pointer-events:none;z-index:490;";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    function resize() {
      const s = map.getSize();
      canvas.width = s.x;
      canvas.height = s.y;
    }
    resize();

    dropsRef.current = [];
    for (let idx = 0; idx < waves.length; idx++) {
      const pt = waves[idx];
      for (let i = 0; i < DROPS_PER_STATION; i++) {
        dropsRef.current.push(makeDrop(idx, pt.lat, pt.lon));
      }
    }

    function draw(now: number) {
      const dt = Math.min((now - lastTimeRef.current) / 16.667, 3);
      lastTimeRef.current = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = wavesRef.current;

      for (const d of dropsRef.current) {
        const pt = pts[d.stationIdx];
        if (!pt) continue;

        // Waves travel TO (opposite of wave_from_direction)
        const toRad = ((pt.waveDirection + 180) * Math.PI) / 180;
        const cosLat = Math.cos((d.lat * Math.PI) / 180);
        const speed = pt.waveHeight * VISUAL_MPS;

        const dLat = (Math.cos(toRad) * speed * dt) / (111320 * 60);
        const dLon = (Math.sin(toRad) * speed * dt) / (111320 * cosLat * 60);

        d.lat += dLat;
        d.lon += dLon;
        d.trail.push([d.lat, d.lon]);
        if (d.trail.length > TRAIL_LENGTH) d.trail.shift();
        d.age += dt;

        const driftLat = Math.abs(d.lat - pt.lat);
        const driftLon = Math.abs(d.lon - pt.lon);
        if (d.age >= d.maxAge || driftLat > SPAWN_SPREAD_DEG * 3 || driftLon > SPAWN_SPREAD_DEG * 3) {
          Object.assign(d, makeDrop(d.stationIdx, pt.lat, pt.lon));
          continue;
        }

        if (d.trail.length < 2) continue;

        // Project trail to canvas pixels
        const px = d.trail.map(([lat, lon]) => {
          const cp = map.latLngToContainerPoint(L.latLng(lat, lon));
          return [cp.x, cp.y] as [number, number];
        });

        const head = px[px.length - 1];
        if (
          head[0] < -60 || head[0] > canvas.width + 60 ||
          head[1] < -60 || head[1] > canvas.height + 60
        ) continue;

        const lifeAlpha = Math.sin((d.age / d.maxAge) * Math.PI);

        // Fading tail — narrow translucent line
        if (px.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(px[0][0], px[0][1]);
          for (let i = 1; i < px.length - 1; i++) {
            ctx.lineTo(px[i][0], px[i][1]);
          }
          ctx.strokeStyle = dropColor(pt.waveHeight, lifeAlpha * 0.35);
          ctx.lineWidth = 1;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        // Head — filled drop circle
        ctx.beginPath();
        ctx.arc(head[0], head[1], DROP_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = dropColor(pt.waveHeight, lifeAlpha * 0.9);
        ctx.fill();

        // Subtle inner highlight
        ctx.beginPath();
        ctx.arc(head[0] - 0.7, head[1] - 0.7, DROP_RADIUS * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${lifeAlpha * 0.5})`;
        ctx.fill();
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
  }, [map, waves]);

  return null;
}

function createWaveIcon(waveHeight: number, waveDirection: number): L.DivIcon {
  const color = waveSolidColor(waveHeight);
  const size = 36;
  // Arrow points in direction waves travel TO (opposite of "from")
  const toDir = (waveDirection + 180) % 360;

  return L.divIcon({
    className: "",
    iconSize: [size, size + 18],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <div style="
          width:${size}px;height:${size}px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(0,10,40,0.6);
          border:1.5px solid ${color};
          border-radius:50%;
          box-shadow:0 1px 6px rgba(0,0,0,0.5);
        ">
          <svg width="20" height="20" viewBox="0 0 22 22" style="transform:rotate(${toDir}deg);overflow:visible;">
            <line x1="11" y1="17" x2="11" y2="5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            <polyline points="7,10 11,4 15,10" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          </svg>
        </div>
        <span style="font-size:9px;font-weight:700;color:#fff;background:rgba(0,10,40,0.65);border-radius:3px;padding:0 3px;white-space:nowrap;">${waveHeight.toFixed(1)} m</span>
      </div>`,
  });
}

export default function WavesLayer() {
  const [waves, setWaves] = useState<WavePoint[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/ocean");
      if (!res.ok) return;
      const data = await res.json();
      setWaves(data);
    } catch {
      // Keep last data on error
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <>
      <WavesCanvas waves={waves} />
      {waves.map((pt) => (
        <Marker
          key={`${pt.lat}-${pt.lon}`}
          position={[pt.lat, pt.lon]}
          icon={createWaveIcon(pt.waveHeight, pt.waveDirection)}
          interactive
          zIndexOffset={900}
        >
          <Tooltip direction="top" offset={[0, -26]} opacity={0.95}>
            <div style={{ minWidth: 150 }}>
              <p style={{ fontWeight: 700, marginBottom: 2 }}>{pt.label}</p>
              <p>🌊 {pt.waveHeight.toFixed(2)} m significant height</p>
              <p>🧭 From {pt.waveDirection.toFixed(0)}°</p>
              <p>⏱ {pt.wavePeriod.toFixed(1)} s period</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
