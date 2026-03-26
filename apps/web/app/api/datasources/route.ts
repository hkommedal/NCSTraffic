import { NextResponse } from "next/server";
import { getRegistry } from "@/lib/datasource-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const registry = getRegistry();

  const entries = Object.entries(registry).map(([key, info]) => ({
    key,
    name: info.name,
    description: info.description,
    url: info.url,
    lastFetchedAt: info.lastFetchedAt?.toISOString() ?? null,
    error: info.error,
  }));

  return NextResponse.json(entries);
}
