"use client";

import { useEffect, useState, useCallback } from "react";
import { Marker, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet-iconmaterial/dist/leaflet.icon-material.js";
import { icon as faIcon, library } from "@fortawesome/fontawesome-svg-core";
import { faHelicopter } from "@fortawesome/free-solid-svg-icons";
import type { Flight } from "@/lib/schemas/flightradar";
import type { LatLngTuple } from "leaflet";
import { useLayerStore } from "@/lib/store/layers";
import { airportCoords, nearestAirport } from "@/lib/data/airports";

library.add(faHelicopter);

const REFRESH_INTERVAL = 30_000;

function helicopterIcon(): L.DivIcon {
  const w = 36, h = 36;
  const rawSvg = faIcon(faHelicopter)?.html[0] ?? "";
  const innerSvg = rawSvg.replace(
    "<svg ",
    `<svg width="20" height="20" style="fill:#e65100;flex-shrink:0;" `,
  );
  return L.divIcon({
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h / 2],
    html: `<div style="
      width:${w}px;height:${h}px;
      display:flex;align-items:center;justify-content:center;
      background:rgba(230,81,0,0.15);
      border:1.5px solid #e65100;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    ">${innerSvg}</div>`,
  });
}

function fixedWingIcon(): L.DivIcon {
  return L.IconMaterial.icon({
    icon: "flight",
    iconColor: "#fff",
    markerColor: "#1565c0",
    outlineColor: "#333",
    outlineWidth: 1,
    iconSize: [31, 42],
  }) as unknown as L.DivIcon;
}

/** Project a point distKm along a heading (degrees) from lat/lon. */
function projectPoint(lat: number, lon: number, headingDeg: number, distKm: number): LatLngTuple {
  const R = 6371;
  const d = distKm / R;
  const θ = (headingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lon * Math.PI) / 180;
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(θ));
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(d) * Math.cos(φ1),
      Math.cos(d) - Math.sin(φ1) * Math.sin(φ2),
    );
  return [(φ2 * 180) / Math.PI, (λ2 * 180) / Math.PI];
}

/**
 * Build route segments for a helicopter:
 * - From known origin OR nearest heliport → current position (where it came from)
 * - From current position → known destination OR 30 km forward heading projection
 */
function helicopterRouteSegments(
  flight: Flight,
): [LatLngTuple, LatLngTuple][] {
  const pos: LatLngTuple = [flight.latitude, flight.longitude];
  const origin: LatLngTuple = airportCoords(flight.origin) ?? nearestAirport(flight.latitude, flight.longitude);
  const dest: LatLngTuple =
    airportCoords(flight.destination) ??
    projectPoint(flight.latitude, flight.longitude, flight.heading ?? 0, 30);
  return [
    [origin, pos],
    [pos, dest],
  ];
}

export default function FlightsLayer() {
  const helicopterRoutes = useLayerStore((s) => s.helicopterRoutes);
  const [flights, setFlights] = useState<Flight[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/flights?helicopters=true");
      if (!res.ok) return;
      const data = await res.json();
      setFlights(data);
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
      {/* Helicopter route lines: nearest heliport → current pos → forward heading */}
      {helicopterRoutes &&
        flights
          .filter((f) => f.isHelicopter)
          .flatMap((flight) =>
            helicopterRouteSegments(flight).map((seg, i) => (
              <Polyline
                key={`${flight.id}-seg-${i}`}
                positions={seg}
                pathOptions={{
                  color: "#e65100",
                  weight: i === 0 ? 2 : 1.5,
                  opacity: i === 0 ? 0.7 : 0.4,
                  dashArray: i === 0 ? undefined : "6 6",
                }}
              />
            )),
          )}

      {flights.map((flight) => (
        <Marker
          key={flight.id}
          position={[flight.latitude, flight.longitude]}
          icon={flight.isHelicopter ? helicopterIcon() : fixedWingIcon()}
        >
          <Tooltip>
            <div className="text-sm">
              <p className="font-bold">
                {flight.callsign || flight.flightNumber || "Unknown"}
              </p>
              {flight.aircraftType && <p>Type: {flight.aircraftType}</p>}
              <p>Alt: {flight.altitude} ft</p>
              <p>Speed: {flight.groundSpeed} kn</p>
              {flight.origin && <p>From: {flight.origin}</p>}
              {flight.destination && <p>To: {flight.destination}</p>}
              {flight.isHelicopter && (
                <p className="font-semibold text-orange-600">Helicopter</p>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
