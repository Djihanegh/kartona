import type { PrintElement, PrintProcess, Substrate } from "@kartona/shared";

// Types partagés avec l'API
export type {
  BoxParams,
  Flute,
  PrintElement,
  PrintProcess,
  Substrate,
} from "@kartona/shared";
export { FLUTE_THICKNESS } from "@kartona/shared";

// Types propres à l'éditeur (ils utilisent des objets du navigateur)
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
  colors: Record<PrintElement, string>;
  brand: string;
  logo: HTMLImageElement | null;
  logoScale: number;
  logoInks: string[] | null;
}
