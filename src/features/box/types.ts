// --- La boîte (phase 1) ---
export type Flute = "E" | "B";

export interface BoxParams {
  length: number; // mm, intérieur
  width: number; // mm
  height: number; // mm
  flute: Flute;
  fold: number; // 0 = à plat, 1 = fermée
}

export const FLUTE_THICKNESS: Record<Flute, number> = { E: 1.5, B: 3 };

// --- L'impression (phase 2) ---

export type PrintProcess = "flexo" | "offset";

export type Substrate = "kraft" | "white";

export type FaceId =
  | "bottom"
  | "front"
  | "back"
  | "left"
  | "right"
  | "lid"
  | "flap";

export interface Design {
  substrate: Substrate;
  process: PrintProcess;
  logo: HTMLImageElement | null;
  logoScale: number;
  brand: string;
  inkColor: string;
}
