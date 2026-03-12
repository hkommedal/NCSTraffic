"use client";

import { useState } from "react";
import { Polygon, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { icon as faIcon, library } from "@fortawesome/fontawesome-svg-core";
import { faGears, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { ormenLangePolygon, ormenLangeField, ormenLangeFacilities } from "@/lib/data/ormen-lange";

library.add(faGears, faTableCells);

type FacilityType = "processing" | "template";

function iconSizeForZoom(zoom: number): number {
  if (zoom >= 11) return 30;
  if (zoom >= 10) return 24;
  if (zoom >= 9) return 18;
  if (zoom >= 8) return 12;
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
  if (type === "processing") return faCircleIcon(faGears, "#c62828", "rgba(198,40,40,0.15)", zoom);
  /* template */ return faCircleIcon(faTableCells, "#00695c", "rgba(0,105,92,0.15)", zoom);
}

export default function OrmenLangeLayer({
  facilityTypes,
}: {
  facilityTypes: Record<string, boolean>;
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  return (
    <>
      <Polygon
        positions={ormenLangePolygon}
        pathOptions={{
          color: "#6a1b9a",
          weight: 2,
          fillColor: "#ab47bc",
          fillOpacity: 0.2,
        }}
      >
        <Popup>
          <div className="text-sm">
            <h3 className="text-base font-bold">{ormenLangeField.name}</h3>
            <p className="mt-1">
              <strong>Operator:</strong> {ormenLangeField.operator}
            </p>
            <p>
              <strong>Status:</strong> {ormenLangeField.status}
            </p>
            <p>
              <strong>Discovery:</strong> {ormenLangeField.discoveryYear}
            </p>
            <p>
              <strong>Production start:</strong> {ormenLangeField.productionStart}
            </p>
            <p>
              <strong>Water depth:</strong> {ormenLangeField.waterDepthM} m
            </p>
            <p className="mt-1 text-gray-600">{ormenLangeField.description}</p>
          </div>
        </Popup>
      </Polygon>

      {zoom >= 7 &&
        ormenLangeFacilities
          .filter((f) => facilityTypes[f.type])
          .map((facility) => (
            <Marker
              key={facility.name}
              position={facility.position}
              icon={facilityIcon(facility.type as FacilityType, zoom)}
            >
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
