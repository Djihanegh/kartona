import { FLUTE_THICKNESS, type BoxParams } from "./types";

export const thickness = (p: BoxParams) => FLUTE_THICKNESS[p.flute];
export const flapLength = (p: BoxParams) =>
  Math.round(Math.min(p.height * 0.85, 80));

// Interpolation douce entre a et b
const ease = (a: number, b: number, v: number) => {
  const k = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

// Angle de chaque charnière selon l'avancement du pliage
export function foldAngles(fold: number) {
  const q = Math.PI / 2;
  return {
    walls: ease(0, 0.45, fold) * q,
    lid: ease(0.5, 0.85, fold) * q,
    flap: ease(0.62, 1, fold) * q,
  };
}

// --- Les charnières : une seule description, utilisée par l'affichage et par l'export ---
export interface Hinge {
  hinge: keyof ReturnType<typeof foldAngles>; // "walls" | "lid" | "flap"
  axis: "x" | "z";
  sign: 1 | -1;
}

export const HINGES: Record<
  "front" | "back" | "right" | "left" | "lid" | "flap",
  Hinge
> = {
  front: { hinge: "walls", axis: "x", sign: -1 },
  back: { hinge: "walls", axis: "x", sign: 1 },
  right: { hinge: "walls", axis: "z", sign: 1 },
  left: { hinge: "walls", axis: "z", sign: -1 },
  lid: { hinge: "lid", axis: "x", sign: 1 },
  flap: { hinge: "flap", axis: "x", sign: 1 },
};

export function hingeRotation(
  h: Hinge,
  fold: number,
): [number, number, number] {
  const angle = foldAngles(fold)[h.hinge] * h.sign;
  return h.axis === "x" ? [angle, 0, 0] : [0, 0, angle];
}
