"use client";

import { MapContainer, TileLayer, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-iconmaterial/dist/leaflet.icon-material.css";
import JohanSverdrupLayer from "./layers/JohanSverdrupLayer";
import VesselsLayer from "./layers/VesselsLayer";
import FlightsLayer from "./layers/FlightsLayer";
import WeatherLayer from "./layers/WeatherLayer";
import LayerControl from "./LayerControl";
import { useLayerStore } from "@/lib/store/layers";

import type { LatLngTuple } from "leaflet";

const NORTH_SEA_CENTER: LatLngTuple = [58.925, 2.455];
const DEFAULT_ZOOM = 8;

export default function MapInner() {
  const johanSverdrup = useLayerStore((s) => s.johanSverdrup);
  const vessels = useLayerStore((s) => s.vessels);
  const flights = useLayerStore((s) => s.flights);
  const weather = useLayerStore((s) => s.weather);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={NORTH_SEA_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl position="bottomleft" />
        {johanSverdrup && <JohanSverdrupLayer />}
        {vessels && <VesselsLayer />}
        {flights && <FlightsLayer />}
        {weather && <WeatherLayer />}
      </MapContainer>
      <LayerControl />
    </div>
  );
}
