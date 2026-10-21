import type { Design, Substrate } from "../box/types";
import type { FaceSpec } from "../box/faces";
import { toSingleInk } from "./flexo";
import { PROCESSES } from "./processes";

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

// --- Outils de dessin ---
type LogoSource = HTMLImageElement | HTMLCanvasElement;

// Offset : logo en couleurs d'origine. Flexo : logo converti en aplat d'une encre.
function logoSource(d: Design): LogoSource | null {
  if (!d.logo) return null;
  return PROCESSES[d.process].fullColor
    ? d.logo
    : toSingleInk(d.logo, d.inkColor);
}

// Dessine le logo centré en (cx, cy), son plus grand côté mesurant `size`
function drawLogo(
  x: CanvasRenderingContext2D,
  src: LogoSource,
  cx: number,
  cy: number,
  size: number,
) {
  const w =
    src instanceof HTMLImageElement ? src.naturalWidth || 512 : src.width;
  const h =
    src instanceof HTMLImageElement ? src.naturalHeight || 512 : src.height;
  const k = size / Math.max(w, h);
  x.drawImage(src, cx - (w * k) / 2, cy - (h * k) / 2, w * k, h * k);
}

// Réduit la police si le texte dépasse la largeur disponible
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

  // Couvercle : logo au centre, nom de la marque en dessous
  lid: (x, w, h, d) => {
    const m = Math.min(w, h);
    const logo = logoSource(d);
    const hasText = d.brand.trim().length > 0;
    const size = (m * d.logoScale) / 100;
    const shift = logo && hasText ? m * 0.07 : 0;

    if (logo) drawLogo(x, logo, w / 2, h / 2 - shift, size);
    if (hasText) {
      x.fillStyle = d.inkColor;
      x.textAlign = "center";
      x.textBaseline = "middle";
      fitText(x, d.brand, 800, w * 0.8, m * 0.09);
      const y = logo ? h / 2 - shift + size / 2 + m * 0.07 : h / 2;
      x.fillText(d.brand, w / 2, y);
    }
  },

  // Face avant : logo à gauche, nom de la marque à droite
  front: (x, w, h, d) => {
    const logo = logoSource(d);
    const hasText = d.brand.trim().length > 0;
    const size = logo ? h * 0.55 * Math.min(1.3, d.logoScale / 55) : 0;

    x.fillStyle = d.inkColor;
    x.textAlign = "left";
    x.textBaseline = "middle";
    let textW = 0;
    if (hasText) {
      fitText(x, d.brand, 800, w * 0.62, h * 0.26);
      textW = x.measureText(d.brand).width;
    }
    const gap = logo && hasText ? h * 0.12 : 0;
    const start = (w - (size + gap + textW)) / 2;

    if (logo) drawLogo(x, logo, start + size / 2, h / 2, size);
    if (hasText) x.fillText(d.brand, start + size + gap, h / 2);
  },

  // Côtés : pictogramme « haut »
  side: (x, w, h, d) => {
    x.fillStyle = d.inkColor;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, "↑ HAUT", 700, w * 0.6, Math.min(w, h) * 0.18);
    x.fillText("↑ HAUT", w / 2, h / 2);
  },

  // Arrière : mention d'origine
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

  // 2. L'encre se superpose au carton (pas de blanc sur du kraft)
  x.globalCompositeOperation = "multiply";

  // 3. On oriente le repère pour que le contenu soit droit une fois la boîte pliée
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

  // 4. On dessine le contenu de la face
  painters[spec.content](x, w, h, design);
  return c;
}
