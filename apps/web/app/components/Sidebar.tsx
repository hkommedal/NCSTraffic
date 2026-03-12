"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayerStore, FACILITY_TYPES } from "@/lib/store/layers";
import { useThemeStore } from "@/lib/store/theme";

type LayerRowProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
};

function LayerRow({ label, active, onClick, color }: LayerRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150 select-none cursor-pointer ${
        active
          ? "text-slate-800 bg-slate-200 hover:bg-slate-300 dark:text-white dark:bg-white/10 dark:hover:bg-white/15"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-white/35 dark:hover:bg-white/5 dark:hover:text-white/60"
      }`}
    >
      <span
        className="size-2 rounded-full shrink-0 transition-colors duration-150"
        style={{ background: active ? color : "#9ca3af" }}
      />
      {label}
    </button>
  );
}

function FieldsSection() {
  const [open, setOpen] = useState(true);
  const johanSverdrup = useLayerStore((s) => s.johanSverdrup);
  const brage = useLayerStore((s) => s.brage);
  const toggle = useLayerStore((s) => s.toggle);

  const fields = [
    { key: "johanSverdrup" as const, label: "Johan Sverdrup", active: johanSverdrup, color: "#3b82f6" },
    { key: "brage" as const, label: "Brage", active: brage, color: "#fb923c" },
  ];
  const activeCount = fields.filter((f) => f.active).length;
  const anyActive = activeCount > 0;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150 select-none cursor-pointer ${
          anyActive
            ? "text-slate-800 bg-slate-200 hover:bg-slate-300 dark:text-white dark:bg-white/10 dark:hover:bg-white/15"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-white/35 dark:hover:bg-white/5 dark:hover:text-white/60"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className="size-2 rounded-full shrink-0 transition-colors duration-150"
            style={{ background: anyActive ? "#3b82f6" : "#9ca3af" }}
          />
          Fields
          <span className="rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            {activeCount}/{fields.length}
          </span>
        </span>
        <svg
          width="9" height="9" viewBox="0 0 10 10" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="2,3 5,7 8,3" />
        </svg>
      </button>

      {open && (
        <div className="ml-4 mt-0.5 flex flex-col">
          {fields.map(({ key, label, active, color }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <span
                className="size-2 shrink-0 rounded-full transition-colors"
                style={{ background: active ? color : "#9ca3af" }}
              />
              <span className="text-xs text-slate-700 select-none flex-1 dark:text-white/75">{label}</span>
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle(key)}
                className="accent-blue-400"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function FacilitiesSection() {
  const [open, setOpen] = useState(false);
  const facilityTypes = useLayerStore((s) => s.facilityTypes);
  const toggleFacilityType = useLayerStore((s) => s.toggleFacilityType);

  const activeCount = Object.values(facilityTypes).filter(Boolean).length;
  const anyActive = activeCount > 0;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150 select-none cursor-pointer ${
          anyActive
            ? "text-slate-800 bg-slate-200 hover:bg-slate-300 dark:text-white dark:bg-white/10 dark:hover:bg-white/15"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-white/35 dark:hover:bg-white/5 dark:hover:text-white/60"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className="size-2 rounded-full shrink-0 transition-colors duration-150"
            style={{ background: anyActive ? "#f59e0b" : "#9ca3af" }}
          />
          Facilities
          <span className="rounded-full bg-amber-100 px-1.5 py-px text-[10px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            {activeCount}/{FACILITY_TYPES.length}
          </span>
        </span>
        <svg
          width="9" height="9" viewBox="0 0 10 10" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="2,3 5,7 8,3" />
        </svg>
      </button>

      {open && (
        <div className="ml-4 mt-0.5 flex flex-col">
          {FACILITY_TYPES.map(({ type, label, color }) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <span
                className="size-2 shrink-0 rounded-full transition-colors"
                style={{ background: facilityTypes[type] ? color : "#9ca3af" }}
              />
              <span className="text-xs text-slate-700 select-none flex-1 dark:text-white/75">{label}</span>
              <input
                type="checkbox"
                checked={facilityTypes[type]}
                onChange={() => toggleFacilityType(type)}
                className="accent-amber-400"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function NavRow({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold tracking-wide transition-all duration-150 select-none ${
        active
          ? "text-slate-800 bg-slate-200 dark:text-white dark:bg-white/10"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70"
      }`}
    >
      {active && <span className="size-1.5 rounded-full bg-cyan-500 shrink-0" />}
      {label}
    </Link>
  );
}

function ThemeToggleRow() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 cursor-pointer select-none dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70"
    >
      {theme === "dark" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const flights = useLayerStore((s) => s.flights);
  const helicopterRoutes = useLayerStore((s) => s.helicopterRoutes);
  const airports = useLayerStore((s) => s.airports);
  const weather = useLayerStore((s) => s.weather);
  const waves = useLayerStore((s) => s.waves);
  const toggle = useLayerStore((s) => s.toggle);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-[1000] flex flex-col bg-slate-100/90 backdrop-blur-md border-r border-slate-200 dark:bg-black/60 dark:border-white/10 transition-all duration-200 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Edge collapse button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-7 rounded-full border bg-slate-100 text-slate-400 border-slate-300 hover:text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm dark:bg-[#1a1f2e] dark:border-white/15 dark:text-white/30 dark:hover:text-white/70 dark:hover:bg-white/10 transition-all duration-150 cursor-pointer"
      >
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
        >
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center justify-center py-5 select-none shrink-0">
        <div style={{
          width: "52px", height: "52px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(6,182,212,0.12)",
          border: "1.5px solid #06b6d4",
          borderRadius: "50%",
          boxShadow: "0 1px 6px rgba(0,0,0,0.4)",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.08em", color: "#22d3ee" }}>NCS</span>
        </div>
        {!collapsed && (
          <span className="mt-1.5 text-slate-800 font-semibold tracking-wide text-sm dark:text-white">
            Traffic
          </span>
        )}
      </div>

      <div className="h-px bg-slate-200 dark:bg-white/10 mx-3 shrink-0" />

      {/* Layers — hidden when collapsed */}
      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 px-2 mb-1.5">
              Layers
            </p>
            <FieldsSection />
            <FacilitiesSection />
            <div className="h-px bg-slate-200 dark:bg-white/8 my-1.5" />
            <LayerRow label="Helicopters" active={flights} onClick={() => toggle("flights")} color="#fb923c" />
            <LayerRow label="Routes" active={helicopterRoutes} onClick={() => toggle("helicopterRoutes")} color="#e65100" />
            <LayerRow label="Airports" active={airports} onClick={() => toggle("airports")} color="#94a3b8" />
            <LayerRow label="Wind" active={weather} onClick={() => toggle("weather")} color="#a855f7" />
            <LayerRow label="Waves" active={waves} onClick={() => toggle("waves")} color="#0ea5e9" />
          </div>

          <div className="h-px bg-slate-200 dark:bg-white/10 mx-3 shrink-0" />

          {/* Footer */}
          <div className="px-3 py-3 shrink-0 flex flex-col gap-0.5">
            <NavRow href="/" label="Map" />
            <NavRow href="/datasources" label="Data Sources" />
            <div className="h-px bg-slate-200 dark:bg-white/8 my-1" />
            <ThemeToggleRow />
          </div>
        </>
      )}
    </aside>
  );
}
