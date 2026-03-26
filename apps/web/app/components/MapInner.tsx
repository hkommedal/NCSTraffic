"use client";

import { MapContainer, TileLayer, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-iconmaterial/dist/leaflet.icon-material.css";
import JohanSverdrupLayer from "./layers/JohanSverdrupLayer";
import BrageLayer from "./layers/BrageLayer";
import EkofiskLayer from "./layers/EkofiskLayer";
import TrollLayer from "./layers/TrollLayer";
import OrmenLangeLayer from "./layers/OrmenLangeLayer";
import VesselsLayer from "./layers/VesselsLayer";
import FlightsLayer from "./layers/FlightsLayer";
import WeatherLayer from "./layers/WeatherLayer";
import WavesLayer from "./layers/WavesLayer";
import AirportsLayer from "./layers/AirportsLayer";
import { useLayerStore } from "@/lib/store/layers";

import type { LatLngTuple } from "leaflet";

const NORTH_SEA_CENTER: LatLngTuple = [58.925, 2.455];
const DEFAULT_ZOOM = 8;

export default function MapInner() {
  const johanSverdrup = useLayerStore((s) => s.johanSverdrup);
  const brage = useLayerStore((s) => s.brage);
  const ekofisk = useLayerStore((s) => s.ekofisk);
  const troll = useLayerStore((s) => s.troll);
  const ormenLange = useLayerStore((s) => s.ormenLange);
  const facilityTypes = useLayerStore((s) => s.facilityTypes);
  const vessels = useLayerStore((s) => s.vessels);
  const flights = useLayerStore((s) => s.flights);
  const airports = useLayerStore((s) => s.airports);
  const weather = useLayerStore((s) => s.weather);
  const waves = useLayerStore((s) => s.waves);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={NORTH_SEA_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl position="bottomleft" />
        {johanSverdrup && <JohanSverdrupLayer facilityTypes={facilityTypes} />}
        {brage && <BrageLayer facilityTypes={facilityTypes} />}
        {ekofisk && <EkofiskLayer facilityTypes={facilityTypes} />}
        {troll && <TrollLayer facilityTypes={facilityTypes} />}
        {ormenLange && <OrmenLangeLayer facilityTypes={facilityTypes} />}
        {vessels && <VesselsLayer />}
        {flights && <FlightsLayer />}
        {airports && <AirportsLayer />}
        {weather && <WeatherLayer />}
        {waves && <WavesLayer />}
      </MapContainer>
    </div>
  );
}
