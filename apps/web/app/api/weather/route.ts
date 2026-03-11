import { NextResponse } from "next/server";
import { fetchWeatherGrid } from "@/lib/services/met";

export async function GET() {
  try {
    const weather = await fetchWeatherGrid();
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 502 });
  }
}
