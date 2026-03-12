import { NextResponse } from "next/server";
import { fetchWeatherGrid } from "@/lib/services/met";
import { recordFetch } from "@/lib/datasource-registry";

export async function GET() {
  try {
    const weather = await fetchWeatherGrid();
    recordFetch("weather");
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    recordFetch("weather", msg);
    console.error("Weather API error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 502 });
  }
}
