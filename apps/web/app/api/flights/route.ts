import { type NextRequest, NextResponse } from "next/server";
import { fetchFlights } from "@/lib/services/flightradar";

export async function GET(request: NextRequest) {
  try {
    const flights = await fetchFlights();
    const helicoptersOnly = request.nextUrl.searchParams.get("helicopters") === "true";
    const filtered = helicoptersOnly ? flights.filter((f) => f.isHelicopter) : flights;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Flights API error:", error);
    return NextResponse.json({ error: "Failed to fetch flight data" }, { status: 502 });
  }
}
