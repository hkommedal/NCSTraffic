"use client";

import { useLayerStore } from "@/lib/store/layers";

export default function LayerControl() {
  const johanSverdrup = useLayerStore((s) => s.johanSverdrup);
  const vessels = useLayerStore((s) => s.vessels);
  const flights = useLayerStore((s) => s.flights);
  const weather = useLayerStore((s) => s.weather);
  const toggle = useLayerStore((s) => s.toggle);

  return (
    <div className="absolute top-4 right-4 z-[1000] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-lg bg-white p-3 shadow-md">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Layers</h3>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={johanSverdrup}
          onChange={() => toggle("johanSverdrup")}
          className="accent-blue-600"
        />
        Johan Sverdrup
      </label>
      <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={vessels}
          onChange={() => toggle("vessels")}
          className="accent-green-600"
        />
        Vessels
      </label>
      <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={flights}
          onChange={() => toggle("flights")}
          className="accent-orange-600"
        />
        Flights
      </label>
      <label className="mt-1 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={weather}
          onChange={() => toggle("weather")}
          className="accent-purple-600"
        />
        Weather
      </label>
    </div>
  );
}
