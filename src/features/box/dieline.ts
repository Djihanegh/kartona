import type { BoxParams, FaceId } from "./types";
import { thickness, flapLength } from "./geometry";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Dieline {
  panels: Record<FaceId, Rect>;
  cut: [number, number][]; // contour de découpe (polygone fermé)
  folds: Line[]; // lignes de pliage
  bounds: Rect; // rectangle englobant = format du flan
  panelArea: number; // surface des panneaux, en mm²
}

// Patron vu côté impression, en mm : x vers la droite, y vers le bas (repère SVG)
export function computeDieline(p: BoxParams): Dieline {
  const { length: L, width: W, height: H } = p;
  const Wl = W + 2 * thickness(p); // le couvercle couvre l'épaisseur des parois
  const F = flapLength(p);
  const a = L / 2;
  const b = W / 2;

  const panels: Record<FaceId, Rect> = {
    bottom: { x: -a, y: -b, w: L, h: W },
    front: { x: -a, y: -b - H, w: L, h: H },
    back: { x: -a, y: b, w: L, h: H },
    lid: { x: -a, y: b + H, w: L, h: Wl },
    flap: { x: -a, y: b + H + Wl, w: L, h: F },
    right: { x: a, y: -b, w: H, h: W },
    left: { x: -a - H, y: -b, w: H, h: W },
  };

  // Contour en forme de croix, dans le sens des aiguilles d'une montre
  const bottomEdge = b + H + Wl + F;
  const cut: [number, number][] = [
    [-a, -b - H],
    [a, -b - H],
    [a, -b],
    [a + H, -b],
    [a + H, b],
    [a, b],
    [a, bottomEdge],
    [-a, bottomEdge],
    [-a, b],
    [-a - H, b],
    [-a - H, -b],
    [-a, -b],
  ];

  const folds: Line[] = [
    { x1: -a, y1: -b, x2: a, y2: -b }, // fond / avant
    { x1: -a, y1: b, x2: a, y2: b }, // fond / arrière
    { x1: a, y1: -b, x2: a, y2: b }, // fond / côté droit
    { x1: -a, y1: -b, x2: -a, y2: b }, // fond / côté gauche
    { x1: -a, y1: b + H, x2: a, y2: b + H }, // arrière / couvercle
    { x1: -a, y1: b + H + Wl, x2: a, y2: b + H + Wl }, // couvercle / rabat
  ];

  const bounds: Rect = {
    x: -a - H,
    y: -b - H,
    w: L + 2 * H,
    h: W + 2 * H + Wl + F,
  };
  const panelArea = Object.values(panels).reduce(
    (sum, r) => sum + r.w * r.h,
    0,
  );

  return { panels, cut, folds, bounds, panelArea };
}
