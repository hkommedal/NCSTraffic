import * as z from "zod";

export const flightSchema = z.object({
  id: z.string(),
  icao24: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  heading: z.number(),
  altitude: z.number(),
  groundSpeed: z.number(),
  aircraftType: z.string(),
  registration: z.string(),
  origin: z.string(),
  destination: z.string(),
  flightNumber: z.string(),
  callsign: z.string(),
  verticalSpeed: z.number(),
  isHelicopter: z.boolean(),
});

export type Flight = z.infer<typeof flightSchema>;
