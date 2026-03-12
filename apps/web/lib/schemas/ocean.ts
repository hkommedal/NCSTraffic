import * as z from "zod";

export const wavePointSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  label: z.string(),
  waveHeight: z.number(), // significant wave height (m)
  waveDirection: z.number(), // degrees (meteorological: direction waves come FROM)
  wavePeriod: z.number(), // peak wave period (s)
});

export type WavePoint = z.infer<typeof wavePointSchema>;
