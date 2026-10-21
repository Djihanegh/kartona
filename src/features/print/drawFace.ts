import type { Design, Substrate } from "../box/types";
import type { FaceSpec } from "../box/faces";

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

// --- Le carton : une petite tuile avec du grain, répétée sur la face ---
const tileCache = new Map<Substrate, HTMLCanvasElement>();

function substrateTile(s: Substrate): HTMLCanvasElement {
  const cached = tileCache.get(s);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  x.fillStyle = s === "kraft" ? "#b38956" : "#f1f0ea";
  x.fillRect(0, 0, 256, 256);
  const img = x.getImageData(0, 0, 256, 256);
  const amp = s === "kraft" ? 22 : 7;
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amp;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n * 0.8;
  }
  x.putImageData(img, 0, 0);
  tileCache.set(s, c);
  return c;
}

// --- Texte qui tient dans une largeur donnée ---
function fitText(
  x: CanvasRenderingContext2D,
  text: string,
  weight: number,
  maxW: number,
  maxH: number,
) {
  let size = maxH;
  x.font = `${weight} ${size}px ${FONT}`;
  const w = x.measureText(text).width;
  if (w > maxW) {
    size = (size * maxW) / w;
    x.font = `${weight} ${size}px ${FONT}`;
  }
}

// --- Le contenu de chaque type de face (repère : x vers la droite, y vers le bas, vu de face) ---
type Painter = (
  x: CanvasRenderingContext2D,
  w: number,
  h: number,
  d: Design,
) => void;

const painters: Record<FaceSpec["content"], Painter> = {
  none: () => {},
  lid: (x, w, h, d) => {
    if (!d.brand.trim()) return;
    x.fillStyle = d.inkColor;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, d.brand, 800, w * 0.8, Math.min(w, h) * 0.16);
    x.fillText(d.brand, w / 2, h / 2);
  },
  front: (x, w, h, d) => {
    if (!d.brand.trim()) return;
    x.fillStyle = d.inkColor;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, d.brand, 800, w * 0.7, h * 0.3);
    x.fillText(d.brand, w / 2, h / 2);
  },
  side: (x, w, h, d) => {
    x.fillStyle = d.inkColor;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, "↑ HAUT", 700, w * 0.6, Math.min(w, h) * 0.18);
    x.fillText("↑ HAUT", w / 2, h / 2);
  },
  back: (x, w, h, d) => {
    x.fillStyle = d.inkColor;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, "Fabriqué en Algérie", 500, w * 0.5, h * 0.12);
    x.fillText("Fabriqué en Algérie", w / 2, h / 2);
  },
};

// --- Dessine une face complète sur un canvas ---
export function drawFace(spec: FaceSpec, design: Design): HTMLCanvasElement {
  const ppm = Math.min(3, 1024 / Math.max(spec.u, spec.v)); // pixels par mm
  const cw = Math.max(2, Math.round(spec.u * ppm));
  const ch = Math.max(2, Math.round(spec.v * ppm));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const x = c.getContext("2d")!;

  // 1. Le carton
  x.fillStyle = x.createPattern(substrateTile(design.substrate), "repeat")!;
  x.fillRect(0, 0, cw, ch);

  // 2. L'encre se superpose au carton (le blanc n'existe pas sur du kraft)
  x.globalCompositeOperation = "multiply";

  // 3. On oriente le repère selon la face
  let w = cw;
  let h = ch;
  switch (spec.orientation) {
    case "rotate180":
      x.setTransform(-1, 0, 0, -1, cw, ch);
      break;
    case "rotateCW":
      x.setTransform(0, 1, -1, 0, cw, 0);
      w = ch;
      h = cw;
      break;
    case "rotateCCW":
      x.setTransform(0, -1, 1, 0, 0, ch);
      w = ch;
      h = cw;
      break;
  }

  // 4. On dessine le contenu
  painters[spec.content](x, w, h, design);
  return c;
}
