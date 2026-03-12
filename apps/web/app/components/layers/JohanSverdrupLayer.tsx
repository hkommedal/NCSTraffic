"use client";

import { useState } from "react";
import { Polygon, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { icon as faIcon, library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faCircleDot, faGears, faArrowsUpDown, faDroplet } from "@fortawesome/free-solid-svg-icons";
import {
  johanSverdrupPolygon,
  johanSverdrupField,
  johanSverdrupFacilities,
} from "@/lib/data/johan-sverdrup";

library.add(faHouse, faCircleDot, faGears, faArrowsUpDown, faDroplet);

type FacilityType = "processing" | "drilling" | "riser" | "quarters" | "wellhead";

function iconSizeForZoom(zoom: number): number {
  if (zoom >= 11) return 30;
  if (zoom >= 10) return 24;
  if (zoom >= 9)  return 18;
  if (zoom >= 8)  return 12;
  return 8;
}

function faCircleIcon(
  faIconDef: Parameters<typeof faIcon>[0],
  borderColor: string,
  bgRgba: string,
  zoom: number,
): L.DivIcon {
  const size = iconSizeForZoom(zoom);
  const svgSize = Math.round(size * 0.55);
  const rawSvg = faIcon(faIconDef)?.html[0] ?? "";
  const innerSvg = rawSvg.replace(
    "<svg ",
    `<svg width="${svgSize}" height="${svgSize}" style="fill:white;flex-shrink:0;" `,
  );
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:${bgRgba};
      border:1.5px solid ${borderColor};
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    ">${innerSvg}</div>`,
  });
}

function facilityIcon(type: FacilityType, zoom: number): L.DivIcon {
  if (type === "quarters")   return faCircleIcon(faHouse,        "#1565c0", "rgba(21,101,192,0.15)",  zoom);
  if (type === "drilling")   return faCircleIcon(faCircleDot,    "#e65100", "rgba(230,81,0,0.15)",    zoom);
  if (type === "processing") return faCircleIcon(faGears,        "#c62828", "rgba(198,40,40,0.15)",   zoom);
  if (type === "riser")      return faCircleIcon(faArrowsUpDown, "#6a1b9a", "rgba(106,27,154,0.15)",  zoom);
  /* wellhead */             return faCircleIcon(faDroplet,      "#2e7d32", "rgba(46,125,50,0.15)",   zoom);
}

export default function JohanSverdrupLayer({ facilityTypes }: { facilityTypes: Record<string, boolean> }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  return (
    <>
      <Polygon
        positions={johanSverdrupPolygon}
        pathOptions={{
          color: "#1565c0",
          weight: 2,
          fillColor: "#42a5f5",
          fillOpacity: 0.2,
        }}
      >
        <Popup>
          <div className="text-sm">
            <h3 className="font-bold text-base">{johanSverdrupField.name}</h3>
            <p className="mt-1">
              <strong>Operator:</strong> {johanSverdrupField.operator}
            </p>
            <p>
              <strong>Status:</strong> {johanSverdrupField.status}
            </p>
            <p>
              <strong>Discovery:</strong> {johanSverdrupField.discoveryYear}
            </p>
            <p>
              <strong>Production start:</strong> {johanSverdrupField.productionStart}
            </p>
            <p>
              <strong>Water depth:</strong> {johanSverdrupField.waterDepthM} m
            </p>
            <p className="mt-1 text-gray-600">{johanSverdrupField.description}</p>
          </div>
        </Popup>
      </Polygon>

      {zoom >= 7 && johanSverdrupFacilities.filter((f) => facilityTypes[f.type]).map((facility) => (
        <Marker key={facility.name} position={facility.position} icon={facilityIcon(facility.type as FacilityType, zoom)}>
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold text-base">{facility.name}</h3>
              <p className="mt-1">
                <strong>Type:</strong> {facility.type}
              </p>
              <p>
                <strong>Operator:</strong> {facility.operator}
              </p>
              <p>
                <strong>Start year:</strong> {facility.startYear}
              </p>
              <p className="mt-1 text-gray-600">{facility.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
