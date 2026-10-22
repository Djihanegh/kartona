import { z } from "zod";

export const FluteSchema = z.enum(["E", "B"]);
export type Flute = z.infer<typeof FluteSchema>;

export const FLUTE_THICKNESS: Record<Flute, number> = { E: 1.5, B: 3 };

// Dimensions intérieures en mm (mêmes limites que les curseurs de l'éditeur)
export const BoxParamsSchema = z.object({
  length: z.number().min(100).max(600),
  width: z.number().min(80).max(400),
  height: z.number().min(30).max(300),
  flute: FluteSchema,
});
export type BoxParams = z.infer<typeof BoxParamsSchema>;
