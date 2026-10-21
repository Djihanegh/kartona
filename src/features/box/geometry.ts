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
