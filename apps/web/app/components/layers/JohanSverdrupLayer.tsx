"use client";

import { Polygon, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-iconmaterial/dist/leaflet.icon-material.js";
import {
  johanSverdrupPolygon,
  johanSverdrupField,
  johanSverdrupFacilities,
} from "@/lib/data/johan-sverdrup";

function facilityIcon() {
  return L.IconMaterial.icon({
    icon: "build",
    iconColor: "#fff",
    markerColor: "#1565c0",
    outlineColor: "#0d47a1",
    outlineWidth: 1,
    iconSize: [31, 42],
  });
}

export default function JohanSverdrupLayer() {
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

      {johanSverdrupFacilities.map((facility) => (
        <Marker key={facility.name} position={facility.position} icon={facilityIcon()}>
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
