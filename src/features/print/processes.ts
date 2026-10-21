import type { PrintProcess } from "../box/types";

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
