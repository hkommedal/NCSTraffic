import { NextResponse } from "next/server";
import { fetchOceanGrid } from "@/lib/services/ocean";
import { recordFetch } from "@/lib/datasource-registry";

export async function GET() {
  try {
    const waves = await fetchOceanGrid();
    recordFetch("ocean");
    return NextResponse.json(waves, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    recordFetch("ocean", msg);
    console.error("Ocean API error:", error);
    return NextResponse.json({ error: "Failed to fetch ocean data" }, { status: 502 });
  }
}
