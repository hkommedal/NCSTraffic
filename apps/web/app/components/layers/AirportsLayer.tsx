"use client";

import { Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import { icon as faIcon, library } from "@fortawesome/fontawesome-svg-core";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import type { LatLngTuple } from "leaflet";

library.add(faPlane);

type Airport = {
  code: string;
  name: string;
  position: LatLngTuple;
  city: string;
};

const AIRPORTS: Airport[] = [
  {
    code: "BGO",
    name: "Bergen lufthavn, Flesland",
    position: [60.2934, 5.2181],
    city: "Bergen",
  },
  {
    code: "SVG",
    name: "Stavanger lufthavn, Sola",
    position: [58.8769, 5.6377],
    city: "Stavanger",
  },
  {
    code: "OSL",
    name: "Oslo lufthavn, Gardermoen",
    position: [60.1939, 11.1004],
    city: "Oslo",
  },
  {
    code: "TRD",
    name: "Trondheim lufthavn, Værnes",
    position: [63.4578, 10.9239],
    city: "Trondheim",
  },
  {
    code: "KSU",
    name: "Kristiansund lufthavn, Kvernberget",
    position: [63.1118, 7.8247],
    city: "Kristiansund",
  },
];

function airportIcon(): L.DivIcon {
  const size = 38;
  const svgSize = Math.round(size * 0.52);
  const rawSvg = faIcon(faPlane)?.html[0] ?? "";
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
      background:rgba(15,23,42,0.75);
      border:2px solid #94a3b8;
      border-radius:50%;
      box-shadow:0 1px 6px rgba(0,0,0,0.5);
    ">${innerSvg}</div>`,
  });
}

export default function AirportsLayer() {
  const icon = airportIcon();

  return (
    <>
      {AIRPORTS.map((airport) => (
        <Marker key={airport.code} position={airport.position} icon={icon}>
          <Tooltip permanent direction="right" offset={[14, 0]}>
            <span style={{ fontSize: "11px", fontWeight: 600 }}>{airport.code}</span>
          </Tooltip>
          <Popup>
            <div style={{ fontSize: "13px", minWidth: "140px" }}>
              <p style={{ fontWeight: 700, marginBottom: "2px" }}>{airport.name}</p>
              <p style={{ color: "#6b7280" }}>{airport.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
