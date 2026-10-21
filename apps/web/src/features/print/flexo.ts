// Cache : on ne recalcule pas le même logo avec la même encre
const cache = new WeakMap<HTMLImageElement, Map<string, HTMLCanvasElement>>();

// Convertit une couleur "#245a35" en [rouge, vert, bleu]
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Convertit un logo en aplat d'une seule encre (simulation flexo)
// Pixels foncés = encre, pixels clairs = transparents (on voit le carton)
export function toSingleInk(
  img: HTMLImageElement,
  ink: string,
): HTMLCanvasElement {
  let byInk = cache.get(img);
  if (!byInk) {
    byInk = new Map();
    cache.set(img, byInk);
  }
  const hit = byInk.get(ink);
  if (hit) return hit;

  const srcW = img.naturalWidth || 512;
  const srcH = img.naturalHeight || 512;
  const k = Math.min(1, 800 / Math.max(srcW, srcH)); // limite la taille pour rester rapide

  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(srcW * k));
  c.height = Math.max(1, Math.round(srcH * k));
  const x = c.getContext("2d")!;
  x.drawImage(img, 0, 0, c.width, c.height);

  const data = x.getImageData(0, 0, c.width, c.height);
  const p = data.data;
  const [r, g, b] = hexToRgb(ink);

  for (let i = 0; i < p.length; i += 4) {
    const lum = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255; // 0 = noir, 1 = blanc
    const density = Math.min(1, Math.max(0, (0.92 - lum) * 1.9)); // foncé = encre, clair = rien
    p[i] = r;
    p[i + 1] = g;
    p[i + 2] = b;
    p[i + 3] = Math.round(p[i + 3] * density);
  }

  x.putImageData(data, 0, 0);
  byInk.set(ink, c);
  return c;
}
