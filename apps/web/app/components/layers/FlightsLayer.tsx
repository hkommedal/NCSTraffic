"use client";

import { useEffect, useState, useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet-iconmaterial/dist/leaflet.icon-material.js";
import type { Flight } from "@/lib/schemas/flightradar";

const REFRESH_INTERVAL = 30_000;

function flightIcon(isHelicopter: boolean) {
  return L.IconMaterial.icon({
    icon: "flight",
    iconColor: "#fff",
    markerColor: isHelicopter ? "#e65100" : "#1565c0",
    outlineColor: "#333",
    outlineWidth: 1,
    iconSize: [31, 42],
  });
}

export default function FlightsLayer() {
  const [flights, setFlights] = useState<Flight[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/flights");
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
      {flights.map((flight) => (
        <Marker
          key={flight.id}
          position={[flight.latitude, flight.longitude]}
          icon={flightIcon(flight.isHelicopter)}
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
