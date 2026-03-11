"use client";

import { useEffect, useState, useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet-iconmaterial/dist/leaflet.icon-material.js";
import type { Vessel } from "@/lib/schemas/barentswatch";

const REFRESH_INTERVAL = 60_000;

function getVesselColor(shipType: number | null): string {
  if (shipType === null) return "#9e9e9e";
  if (shipType >= 70 && shipType <= 79) return "#4caf50"; // Cargo
  if (shipType >= 80 && shipType <= 89) return "#f44336"; // Tanker
  if (shipType >= 60 && shipType <= 69) return "#2196f3"; // Passenger
  if (shipType >= 40 && shipType <= 49) return "#ff9800"; // High speed craft
  if (shipType === 30) return "#00bcd4"; // Fishing
  if (shipType >= 50 && shipType <= 59) return "#9c27b0"; // Special craft
  return "#9e9e9e";
}

function vesselIcon(shipType: number | null) {
  return L.IconMaterial.icon({
    icon: "directions_boat",
    iconColor: "#fff",
    markerColor: getVesselColor(shipType),
    outlineColor: "#333",
    outlineWidth: 1,
    iconSize: [31, 42],
  });
}

export default function VesselsLayer() {
  const [vessels, setVessels] = useState<Vessel[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/vessels");
      if (!res.ok) return;
      const data = await res.json();
      setVessels(data);
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
      {vessels.map((vessel) => (
        <Marker
          key={vessel.mmsi}
          position={[vessel.latitude, vessel.longitude]}
          icon={vesselIcon(vessel.shipType)}
        >
          <Tooltip>
            <div className="text-sm">
              <p className="font-bold">{vessel.name ?? "Unknown"}</p>
              <p>MMSI: {vessel.mmsi}</p>
              {vessel.speedOverGround != null && (
                <p>Speed: {vessel.speedOverGround.toFixed(1)} kn</p>
              )}
              {vessel.trueHeading != null && <p>Heading: {vessel.trueHeading}°</p>}
              {vessel.destination && <p>Dest: {vessel.destination}</p>}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
