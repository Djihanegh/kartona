type RGB = [number, number, number];

const hex = (c: RGB) =>
  "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const rgb = (h: string): RGB => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const dist = (a: RGB, b: RGB) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const isPaper = (r: number, g: number, b: number) =>
  r > 235 && g > 235 && b > 235; // blanc = pas d'encre

// Lit les pixels d'une image réduite (pour aller vite)
function readPixels(img: HTMLImageElement, maxSide: number) {
  const w0 = img.naturalWidth || 512;
  const h0 = img.naturalHeight || 512;
  const k = Math.min(1, maxSide / Math.max(w0, h0));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w0 * k));
  c.height = Math.max(1, Math.round(h0 * k));
  const x = c.getContext("2d")!;
  x.drawImage(img, 0, 0, c.width, c.height);
  return { canvas: c, ctx: x, data: x.getImageData(0, 0, c.width, c.height) };
}

// Détecte les couleurs principales du logo (les plus présentes d'abord)
export function extractPalette(img: HTMLImageElement, max: number): string[] {
  const { data } = readPixels(img, 96);
  const p = data.data;
  const buckets = new Map<
    number,
    { r: number; g: number; b: number; n: number }
  >();
  let total = 0;

  for (let i = 0; i < p.length; i += 4) {
    const [r, g, b, a] = [p[i], p[i + 1], p[i + 2], p[i + 3]];
    if (a < 128 || isPaper(r, g, b)) continue;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4); // regroupe les couleurs proches
    const bk = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bk.r += r;
    bk.g += g;
    bk.b += b;
    bk.n++;
    buckets.set(key, bk);
    total++;
  }

  const result: RGB[] = [];
  for (const bk of [...buckets.values()].sort((a, b) => b.n - a.n)) {
    if (bk.n < total * 0.02) break; // ignore les bords et le bruit (< 2 % des pixels)
    const c: RGB = [bk.r / bk.n, bk.g / bk.n, bk.b / bk.n];
    if (result.every((r) => dist(r, c) > 60)) result.push(c); // évite deux encres presque identiques
    if (result.length === max) break;
  }
  return result.map(hex);
}

// Imprime chaque pixel avec l'encre la plus proche (séparation des couleurs)
const cache = new WeakMap<HTMLImageElement, Map<string, HTMLCanvasElement>>();

export function separateToInks(
  img: HTMLImageElement,
  inks: string[],
): HTMLCanvasElement {
  const key = inks.join(",");
  let byKey = cache.get(img);
  if (!byKey) {
    byKey = new Map();
    cache.set(img, byKey);
  }
  const hit = byKey.get(key);
  if (hit) return hit;

  const { canvas, ctx, data } = readPixels(img, 800);
  const p = data.data;
  const palette = inks.map(rgb);

  for (let i = 0; i < p.length; i += 4) {
    if (isPaper(p[i], p[i + 1], p[i + 2])) {
      p[i + 3] = 0; // pas d'encre blanche : on voit le carton
      continue;
    }
    const px: RGB = [p[i], p[i + 1], p[i + 2]];
    let best = palette[0];
    for (const ink of palette) if (dist(ink, px) < dist(best, px)) best = ink;
    [p[i], p[i + 1], p[i + 2]] = best;
  }

  ctx.putImageData(data, 0, 0);
  byKey.set(key, canvas);
  return canvas;
}
