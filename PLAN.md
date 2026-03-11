# Plan: NCS Traffic Map Application (v3)

## TL;DR
Build an interactive Leaflet map of the North Sea showing Johan Sverdrup petroleum field (hardcoded GeoJSON — already done), Flightradar24 flight/helicopter traffic, Barentswatch vessel positions, and Met API weather as always-visible map overlay icons. Phased MVP. Phase 1 is complete.

## Decisions
- **Phased MVP**: Ship working map + one layer first, iterate
- **Johan Sverdrup**: Keep hardcoded GeoJSON (already implemented)
- **Flightradar24 only**: Use existing FR24 credentials
- **Live fetch**: No SQLite caching — all external data fetched live
- **Auto-refresh**: Polling for vessel (~60s) and flight (~30s) positions
- **Server-side API calls**: External APIs called through Next.js API routes
- **Weather overlay**: Always-visible weather icons at grid points on the map (not on-click)

## Changes from v2 plan
- Weather display changed from "popup on click" to **always-visible map overlay with weather condition icons** at fixed grid points across the North Sea
- Phase 1 is now **complete** — no changes needed

---

## Phase 1: Map Foundation + Johan Sverdrup — COMPLETE ✅

Already implemented:
- Leaflet map (full-viewport, OSM tiles, centered on Johan Sverdrup)
- Johan Sverdrup field polygon + 5 facility markers with IconMaterial icons
- Layer toggle UI (Zustand store + checkbox panel)
- `leaflet-iconmaterial` installed + typed

---

## Phase 2: Vessel Traffic (Barentswatch)

**Goal**: Live vessel positions from Barentswatch AIS API on the map.

### Steps

1. **Research Barentswatch AIS API** and authentication flow
   - OAuth2 client credentials: `BARENTSWATCH_CLIENT_ID` + `BARENTSWATCH_CLIENT_SECRET`
   - Token endpoint: `https://id.barentswatch.no/connect/token`
   - AIS endpoint: `https://live.ais.barentswatch.no/v1/...`
   - Geographic bounding box params for North Sea area

2. **Build Barentswatch service** (`apps/web/lib/services/barentswatch.ts`)
   - Token acquisition with client credentials grant
   - Server-side in-memory token cache until expiry
   - Fetch vessel positions within North Sea bounding box
   - Zod schema (`apps/web/lib/schemas/barentswatch.ts`) for vessel response validation
   - *Depends on step 1*

3. **Create vessels API route** (`apps/web/app/api/vessels/route.ts`)
   - `GET` handler — authenticates with Barentswatch, returns vessel positions
   - Optional bounding box query params for viewport-based fetching
   - *Depends on step 2*

4. **Build vessel map layer** (`apps/web/app/components/layers/VesselsLayer.tsx`)
   - Vessel markers with ship icons (IconMaterial)
   - Color-code by vessel type if available
   - Tooltip: vessel name, MMSI, speed, heading
   - *Depends on step 3*

5. **Add auto-refresh + layer toggle**
   - Client-side polling (~60s) to re-fetch vessel positions
   - Seamless marker updates without page reload
   - Add "Vessels" toggle to LayerControl + extend Zustand store
   - *Depends on step 4*

### Phase 2 Verification
- Vessel markers appear on North Sea map
- Auto-refresh every ~60 seconds
- Tooltips show vessel details
- Layer toggle works
- Barentswatch auth handles token refresh
- `pnpm build` passes

---

## Phase 3: Flight Traffic (Flightradar24)

**Goal**: Helicopter and aircraft positions from FR24, especially offshore helicopter routes.

### Steps

6. **Research Flightradar24 API** with existing credentials
   - Available endpoints with access token
   - Bounding box queries for North Sea
   - Helicopter vs fixed-wing filter options
   - *Parallel with Phase 2*

7. **Build FR24 service** (`apps/web/lib/services/flightradar.ts`)
   - Authenticated fetch with `FLIGHTRADAR24_ACCESS_TOKEN` header
   - Fetch flights within North Sea bounding box
   - Zod schema (`apps/web/lib/schemas/flightradar.ts`) for flight response
   - *Depends on step 6*

8. **Create flights API route** (`apps/web/app/api/flights/route.ts`)
   - `GET` handler returning flight positions
   - Optional filter param for helicopters-only mode
   - *Depends on step 7*

9. **Build flight map layer** (`apps/web/app/components/layers/FlightsLayer.tsx`)
   - Helicopter icon for helicopter traffic
   - Airplane icon for fixed-wing
   - Tooltip: callsign, altitude, speed, origin/destination
   - *Depends on step 8*

10. **Add auto-refresh + layer toggle**
    - Polling interval (~30s)
    - Add "Flights" toggle to LayerControl
    - *Depends on step 9*

### Phase 3 Verification
- Flight markers with correct icons (helicopter vs airplane)
- Auto-refresh works
- Tooltips show flight details
- Layer toggle works
- `pnpm build` passes

---

## Phase 4: Weather Overlay (Met API)

**Goal**: Always-visible weather condition icons at grid points across the North Sea, with tooltips showing temperature, wind speed, and detailed info.

### Steps

11. **Build Met API service** (`apps/web/lib/services/met.ts`)
    - Endpoint: `https://api.met.no/weatherapi/locationforecast/2.0/compact`
    - `User-Agent` header identifying the app (required by Met.no TOS)
    - Accept lat/lon params
    - Zod schema (`apps/web/lib/schemas/met.ts`) for weather response
    - *Parallel with Phase 3*

12. **Create weather API route** (`apps/web/app/api/weather/route.ts`)
    - `GET` handler that fetches weather for a predefined grid of North Sea coordinates
    - Returns array of {lat, lon, temperature, windSpeed, windDirection, symbolCode} objects
    - Caches response briefly (Met API rate limits / courtesy) or uses `Cache-Control` headers
    - *Depends on step 11*

13. **Map weather symbol codes to icons**
    - Met API returns `symbol_code` values like "clearsky_day", "rain", "cloudy", etc.
    - Create a mapping from symbol codes to Leaflet DivIcon or IconMaterial icons
    - Use appropriate visual indicators (sun, cloud, rain, storm icons)
    - *Parallel with step 12*

14. **Build weather overlay layer** (`apps/web/app/components/layers/WeatherLayer.tsx`)
    - Fetch weather data from `/api/weather` for ~8-12 grid points across North Sea
    - Render weather icons as markers at each grid point
    - Tooltips on hover/click showing: temperature, wind speed/direction, conditions text
    - Auto-refresh (~10 min interval — weather changes slowly)
    - *Depends on steps 12, 13*

15. **Add weather toggle to LayerControl**
    - Add "Weather" toggle to Zustand store + LayerControl checkbox
    - *Depends on step 14*

### Phase 4 Verification
- Weather icons visible at grid points across the North Sea
- Icons represent actual conditions (sun, cloud, rain, etc.)
- Tooltips show temperature, wind speed/direction
- Auto-refresh every ~10 minutes
- Layer toggle works
- Met API called with proper User-Agent header
- `pnpm build` passes

---

## Phase 5: Polish & Integration

**Goal**: UX polish, error handling, production readiness.

### Steps

16. **Loading states** — spinners/skeletons while data fetches
17. **Error handling** — graceful fallbacks when external APIs are down
18. **Map controls** — zoom controls, scale bar, coordinate display
19. **Responsive layout** — mobile-friendly map + controls
20. **Update `.env.local.example`** — document all required environment variables

### Phase 5 Verification
- No unhandled errors when APIs are down
- Loading indicators shown during fetches
- Mobile viewports work
- `.env.local.example` documents all variables
- `pnpm build` passes

---

## File Map

### Already implemented
- `apps/web/app/page.tsx` — full-screen map page
- `apps/web/app/layout.tsx` — full-viewport layout
- `apps/web/app/globals.css` — Tailwind + full-height
- `apps/web/app/components/Map.tsx` — dynamic import wrapper
- `apps/web/app/components/MapInner.tsx` — Leaflet container + layers
- `apps/web/app/components/LayerControl.tsx` — layer toggle panel
- `apps/web/app/components/layers/JohanSverdrupLayer.tsx` — field polygon + facilities
- `apps/web/lib/data/johan-sverdrup.ts` — static GeoJSON + metadata
- `apps/web/lib/store/layers.ts` — layer visibility store
- `apps/web/types/leaflet-iconmaterial.d.ts` — type declarations

### To modify
- `apps/web/app/components/MapInner.tsx` — add VesselsLayer, FlightsLayer, WeatherLayer
- `apps/web/app/components/LayerControl.tsx` — add vessel/flight/weather toggles
- `apps/web/lib/store/layers.ts` — add vessels, flights, weather booleans
- `apps/web/.env.local.example` — document all API keys

### To create
- `apps/web/lib/services/barentswatch.ts` — Barentswatch API + auth
- `apps/web/lib/services/flightradar.ts` — FR24 API client
- `apps/web/lib/services/met.ts` — Met.no API client
- `apps/web/lib/schemas/barentswatch.ts` — vessel Zod schemas
- `apps/web/lib/schemas/flightradar.ts` — flight Zod schemas
- `apps/web/lib/schemas/met.ts` — weather Zod schemas
- `apps/web/app/components/layers/VesselsLayer.tsx` — vessel markers
- `apps/web/app/components/layers/FlightsLayer.tsx` — flight markers
- `apps/web/app/components/layers/WeatherLayer.tsx` — weather overlay icons
- `apps/web/app/api/vessels/route.ts` — vessel data API
- `apps/web/app/api/flights/route.ts` — flight data API
- `apps/web/app/api/weather/route.ts` — weather data API

## Further Considerations
1. **Weather grid density**: ~8-12 points across the North Sea is enough for an overlay without cluttering. Can adjust based on zoom level later.
2. **Met API symbol codes**: Over 50 possible codes — group into categories (clear, cloudy, rain, storm, snow, fog) for icon mapping.
3. **Marker clustering**: With thousands of vessels, may need `react-leaflet-markercluster`. Defer to Phase 5.
