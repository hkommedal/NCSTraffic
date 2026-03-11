import * as z from "zod";

export const weatherPointSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  temperature: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  symbolCode: z.string(),
  label: z.string(),
});

export type WeatherPoint = z.infer<typeof weatherPointSchema>;
