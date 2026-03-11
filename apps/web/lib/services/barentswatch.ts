import { vesselsResponseSchema, type Vessel } from "@/lib/schemas/barentswatch";

const TOKEN_URL = "https://id.barentswatch.no/connect/token";
const AIS_BASE_URL = "https://live.ais.barentswatch.no/v1/latest/combined";

// North Sea bounding box (covers Norwegian Continental Shelf)
const NORTH_SEA_BOUNDS = {
  xMin: -2,
  xMax: 8,
  yMin: 56,
  yMax: 62.5,
};

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.BARENTSWATCH_CLIENT_ID;
  const clientSecret = process.env.BARENTSWATCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Barentswatch credentials not configured");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "ais",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Barentswatch auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.accessToken;
}

export async function fetchVessels(): Promise<Vessel[]> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    Xmin: String(NORTH_SEA_BOUNDS.xMin),
    Xmax: String(NORTH_SEA_BOUNDS.xMax),
    Ymin: String(NORTH_SEA_BOUNDS.yMin),
    Ymax: String(NORTH_SEA_BOUNDS.yMax),
  });

  const response = await fetch(`${AIS_BASE_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Barentswatch AIS failed: ${response.status}`);
  }

  const json = await response.json();
  const result = vesselsResponseSchema.safeParse(json);

  if (!result.success) {
    console.error("Barentswatch response validation failed:", result.error);
    throw new Error("Invalid vessel data from Barentswatch");
  }

  return result.data;
}
