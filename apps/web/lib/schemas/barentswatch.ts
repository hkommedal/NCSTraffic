import * as z from "zod";

export const vesselSchema = z.object({
  courseOverGround: z.number().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  name: z.string().nullable(),
  mmsi: z.number(),
  msgtime: z.string(),
  shipType: z.number().nullable(),
  speedOverGround: z.number().nullable(),
  trueHeading: z.number().nullable(),
  destination: z.string().nullable(),
});

export type Vessel = z.infer<typeof vesselSchema>;

export const vesselsResponseSchema = z.array(vesselSchema);
