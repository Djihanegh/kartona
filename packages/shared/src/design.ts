import { z } from "zod";
import { PrintProcessSchema, SubstrateSchema, spotLimit } from "./print";

const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Couleur attendue au format #RRGGBB");

export const DesignSpecSchema = z
  .object({
    substrate: SubstrateSchema,
    process: PrintProcessSchema,
    inks: z.array(HexColor).min(1).max(8),
    assign: z.object({
      logo: z.number().int().min(0),
      brand: z.number().int().min(0),
      marks: z.number().int().min(0),
    }),
    brand: z.string().max(28),
    logoUrl: z.string().nullable(),
    logoScale: z.number().min(20).max(90),
    logoMode: z.enum(["single", "separated"]),
  })
  .refine((d) => d.inks.length <= spotLimit(d.process), {
    message: "Trop d'encres pour ce procédé d'impression",
    path: ["inks"],
  })
  .refine((d) => Object.values(d.assign).every((i) => i < d.inks.length), {
    message: "Un élément utilise une encre qui n'existe pas",
    path: ["assign"],
  });

export type DesignSpec = z.infer<typeof DesignSpecSchema>;
