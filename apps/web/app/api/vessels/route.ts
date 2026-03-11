import { NextResponse } from "next/server";
import { fetchVessels } from "@/lib/services/barentswatch";

export async function GET() {
  try {
    const vessels = await fetchVessels();
    return NextResponse.json(vessels);
  } catch (error) {
    console.error("Vessels API error:", error);
    return NextResponse.json({ error: "Failed to fetch vessel data" }, { status: 502 });
  }
}
