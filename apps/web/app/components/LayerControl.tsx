"use client";

import { useState } from "react";
import { useLayerStore } from "@/lib/store/layers";

const LAYERS = [
  { key: "johanSverdrup", label: "Johan Sverdrup", dot: "#3b82f6" },
  { key: "brage", label: "Brage", dot: "#f97316" },
  { key: "ekofisk", label: "Ekofisk", dot: "#ef4444" },
  { key: "troll", label: "Troll", dot: "#22c55e" },
  { key: "ormenLange", label: "Ormen Lange", dot: "#a855f7" },
  { key: "vessels", label: "Vessels", dot: "#10b981" },
  { key: "flights", label: "Flights", dot: "#fb923c" },
  { key: "weather", label: "Weather", dot: "#8b5cf6" },
] as const;

export default function LayerControl() {
  const [open, setOpen] = useState(false);
  const johanSverdrup = useLayerStore((s) => s.johanSverdrup);
  const brage = useLayerStore((s) => s.brage);
  const ekofisk = useLayerStore((s) => s.ekofisk);
  const troll = useLayerStore((s) => s.troll);
  const ormenLange = useLayerStore((s) => s.ormenLange);
  const vessels = useLayerStore((s) => s.vessels);
  const flights = useLayerStore((s) => s.flights);
  const weather = useLayerStore((s) => s.weather);
  const toggle = useLayerStore((s) => s.toggle);

  const values = { johanSverdrup, brage, ekofisk, troll, ormenLange, vessels, flights, weather };
  const activeCount = Object.values(values).filter(Boolean).length;

  return (
    <div className="fixed top-14 right-4 z-[1000]">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/15 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-black/75 transition-colors"
        aria-expanded={open}
        aria-label="Toggle layers"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="shrink-0"
        >
          <rect x="1" y="2" width="14" height="3" rx="1" />
          <rect x="1" y="6.5" width="14" height="3" rx="1" />
          <rect x="1" y="11" width="14" height="3" rx="1" />
        </svg>
        Layers
        <span className="ml-0.5 rounded-full bg-cyan-500/25 px-1.5 py-0.5 text-xs font-semibold text-cyan-300">
          {activeCount}/{LAYERS.length}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="2,3 5,7 8,3" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="mt-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-white/15 py-2 shadow-xl min-w-[170px]">
          {LAYERS.map(({ key, label, dot }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 px-4 py-1.5 hover:bg-white/10 transition-colors"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: values[key] ? dot : "#4b5563" }}
              />
              <span className="text-sm text-white/90 select-none">{label}</span>
              <input
                type="checkbox"
                checked={values[key]}
                onChange={() => toggle(key)}
                className="ml-auto accent-cyan-400"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
