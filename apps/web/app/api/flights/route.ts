import { type NextRequest, NextResponse } from "next/server";
import { fetchFlights, fetchFlightRoute } from "@/lib/services/flightradar";
import { recordPosition, pruneStale } from "@/lib/services/flight-trails";
import { recordFetch } from "@/lib/datasource-registry";

export async function GET(request: NextRequest) {
  try {
    const flights = await fetchFlights();
    const helicoptersOnly = request.nextUrl.searchParams.get("helicopters") === "true";
    const filtered = helicoptersOnly ? flights.filter((f) => f.isHelicopter) : flights;

    // Enrich helicopters with real origin/destination from FR24 clickhandler
    const enriched = await Promise.all(
      filtered.map(async (flight) => {
        if (!flight.isHelicopter || (flight.origin && flight.destination)) return flight;
        const route = await fetchFlightRoute(flight.id);
        return {
          ...flight,
          origin: route.origin || flight.origin,
          destination: route.destination || flight.destination,
          originName: route.originName,
          destinationName: route.destinationName,
        };
      }),
    );

    // Record positions and attach accumulated trails
    const withTrails = enriched.map((flight) => ({
      ...flight,
      trail: recordPosition(flight.id, flight.latitude, flight.longitude),
    }));

    pruneStale();
    recordFetch("flights");
    return NextResponse.json(withTrails);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    recordFetch("flights", msg);
    console.error("Flights API error:", error);
    return NextResponse.json({ error: "Failed to fetch flight data" }, { status: 502 });
  }
}
