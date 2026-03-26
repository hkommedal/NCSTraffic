import type { LatLngTuple } from "leaflet";

type TimestampedPoint = { pos: LatLngTuple; time: number };

type TrailEntry = {
  points: TimestampedPoint[];
  lastSeen: number;
};

/** Keep up to 6 hours of position data. */
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

/** Drop flights not seen for 6 hours. */
const STALE_MS = MAX_AGE_MS;

/** Minimum distance (degrees, ~100 m) between consecutive trail points to avoid duplicates. */
const MIN_MOVE = 0.001;

/**
 * Singleton in-memory store for flight position trails.
 * Survives Next.js hot reloads in dev via `globalThis`.
 */
function getStore(): Map<string, TrailEntry> {
  const g = globalThis as unknown as { __flightTrails?: Map<string, TrailEntry> };
  if (!g.__flightTrails) {
    g.__flightTrails = new Map();
  }
  return g.__flightTrails;
}

/** Drop points older than 6 hours from an entry. */
function trimOldPoints(entry: TrailEntry, now: number): void {
  const cutoff = now - MAX_AGE_MS;
  const firstValid = entry.points.findIndex((p) => p.time >= cutoff);
  if (firstValid > 0) {
    entry.points = entry.points.slice(firstValid);
  } else if (firstValid === -1) {
    entry.points = [];
  }
}

/** Record a position for a flight and return the accumulated trail. */
export function recordPosition(flightId: string, lat: number, lng: number): LatLngTuple[] {
  const store = getStore();
  const now = Date.now();

  let entry = store.get(flightId);
  if (!entry) {
    entry = { points: [], lastSeen: now };
    store.set(flightId, entry);
  }

  entry.lastSeen = now;

  const prev = entry.points[entry.points.length - 1];
  const moved =
    !prev || Math.abs(prev.pos[0] - lat) > MIN_MOVE || Math.abs(prev.pos[1] - lng) > MIN_MOVE;

  if (moved) {
    entry.points.push({ pos: [lat, lng], time: now });
  }

  trimOldPoints(entry, now);

  return entry.points.map((p) => p.pos);
}

/** Get the trail for a flight without recording a new point. */
export function getTrail(flightId: string): LatLngTuple[] {
  const entry = getStore().get(flightId);
  if (!entry) return [];
  trimOldPoints(entry, Date.now());
  return entry.points.map((p) => p.pos);
}

/** Remove flights that haven't been seen recently. */
export function pruneStale(): void {
  const store = getStore();
  const cutoff = Date.now() - STALE_MS;
  for (const [id, entry] of store) {
    if (entry.lastSeen < cutoff) {
      store.delete(id);
    }
  }
}
