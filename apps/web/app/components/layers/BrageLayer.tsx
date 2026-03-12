"use client";

import { useState } from "react";
import { Polygon, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { icon as faIcon, library } from "@fortawesome/fontawesome-svg-core";
import { faCircleDot, faGears, faDroplet, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { bragePolygon, brageField, brageFacilities } from "@/lib/data/brage";

library.add(faCircleDot, faGears, faDroplet, faTableCells);

type FacilityType = "processing" | "drilling" | "wellhead" | "template";

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
  if (type === "drilling")   return faCircleIcon(faCircleDot,  "#e65100", "rgba(230,81,0,0.15)",   zoom);
  if (type === "processing") return faCircleIcon(faGears,      "#c62828", "rgba(198,40,40,0.15)",  zoom);
  if (type === "template")   return faCircleIcon(faTableCells, "#00695c", "rgba(0,105,92,0.15)",   zoom);
  /* wellhead */             return faCircleIcon(faDroplet,    "#2e7d32", "rgba(46,125,50,0.15)",  zoom);
}

export default function BrageLayer({ facilityTypes }: { facilityTypes: Record<string, boolean> }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  return (
    <>
      <Polygon
        positions={bragePolygon}
        pathOptions={{
          color: "#ef6c00",
          weight: 2,
          fillColor: "#ffb74d",
          fillOpacity: 0.2,
        }}
      >
        <Popup>
          <div className="text-sm">
            <h3 className="text-base font-bold">{brageField.name}</h3>
            <p className="mt-1">
              <strong>Operator:</strong> {brageField.operator}
            </p>
            <p>
              <strong>Status:</strong> {brageField.status}
            </p>
            <p>
              <strong>Discovery:</strong> {brageField.discoveryYear}
            </p>
            <p>
              <strong>Production start:</strong> {brageField.productionStart}
            </p>
            <p>
              <strong>Water depth:</strong> {brageField.waterDepthM} m
            </p>
            <p className="mt-1 text-gray-600">{brageField.description}</p>
          </div>
        </Popup>
      </Polygon>

      {zoom >= 7 && brageFacilities.filter((f) => facilityTypes[f.type]).map((facility) => (
        <Marker key={facility.name} position={facility.position} icon={facilityIcon(facility.type as FacilityType, zoom)}>
          <Popup>
            <div className="text-sm">
              <h3 className="text-base font-bold">{facility.name}</h3>
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
