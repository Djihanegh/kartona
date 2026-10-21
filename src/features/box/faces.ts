import type { BoxParams, FaceId } from "./types";
import { thickness, flapLength } from "./geometry";

// Orientation du dessin pour qu'il soit droit une fois la boîte pliée
export type Orientation = "upright" | "rotate180" | "rotateCW" | "rotateCCW";
export type FaceContent = "none" | "lid" | "front" | "side" | "back";

export interface FaceSpec {
  id: FaceId;
  u: number; // largeur sur le patron (mm), axe x
  v: number; // hauteur sur le patron (mm), axe z
  orientation: Orientation;
  content: FaceContent;
}

export function faceSpecs(p: BoxParams): Record<FaceId, FaceSpec> {
  const { length: L, width: W, height: H } = p;
  const t = thickness(p);
  const F = flapLength(p);
  return {
    bottom: {
      id: "bottom",
      u: L,
      v: W,
      orientation: "upright",
      content: "none",
    },
    front: {
      id: "front",
      u: L,
      v: H,
      orientation: "upright",
      content: "front",
    },
    back: { id: "back", u: L, v: H, orientation: "rotate180", content: "back" },
    right: {
      id: "right",
      u: H,
      v: W,
      orientation: "rotateCW",
      content: "side",
    },
    left: { id: "left", u: H, v: W, orientation: "rotateCCW", content: "side" },
    lid: {
      id: "lid",
      u: L,
      v: W + 2 * t,
      orientation: "upright",
      content: "lid",
    },
    flap: { id: "flap", u: L, v: F, orientation: "upright", content: "none" },
  };
}
