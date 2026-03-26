import { NextResponse } from "next/server";
import { fetchVessels } from "@/lib/services/barentswatch";
import { recordFetch } from "@/lib/datasource-registry";

export async function GET() {
  try {
    const vessels = await fetchVessels();
    recordFetch("vessels");
    return NextResponse.json(vessels);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    recordFetch("vessels", msg);
    console.error("Vessels API error:", error);
    return NextResponse.json({ error: "Failed to fetch vessel data" }, { status: 502 });
  }
}
