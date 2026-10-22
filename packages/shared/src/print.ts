import { z } from "zod";

export const SubstrateSchema = z.enum(["kraft", "white"]);
export type Substrate = z.infer<typeof SubstrateSchema>;

export const PrintProcessSchema = z.enum(["flexo", "offset"]);
export type PrintProcess = z.infer<typeof PrintProcessSchema>;

export const PrintElementSchema = z.enum(["logo", "brand", "marks"]);
export type PrintElement = z.infer<typeof PrintElementSchema>;

export interface ProcessInfo {
  label: string;
  fullColor: boolean; // true = couleurs d'origine du logo, false = aplats d'encre
  maxColors: number; // maximum par défaut ; chaque imprimeur pourra le réduire selon sa machine
  description: string;
}

export const PROCESSES: Record<PrintProcess, ProcessInfo> = {
  flexo: {
    label: "Flexographie",
    fullColor: false,
    maxColors: 8,
    description:
      "Encres en tons directs ; 1 à 4 couleurs en général sur le carton ondulé.",
  },
  offset: {
    label: "Offset",
    fullColor: true,
    maxColors: 6,
    description:
      "Quadri (CMJN) jusqu'à 2 Pantone en plus, pour les étuis et le contrecollage.",
  },
};

// Nombre d'encres en tons directs disponibles (en offset, la quadri occupe 4 groupes)
export function spotLimit(process: PrintProcess): number {
  const info = PROCESSES[process];
  return info.fullColor ? info.maxColors - 4 : info.maxColors;
}
