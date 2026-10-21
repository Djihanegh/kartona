import { useMemo } from "react";
import type { BoxParams, Design, FaceId } from "../box/types";
import { faceSpecs } from "../box/faces";
import { drawFace } from "./drawFace";

export type FaceCanvases = Record<FaceId, HTMLCanvasElement>;

// Dessine le visuel de chaque face (utilisé par la 3D ET par le patron)
export function useFaceCanvases(
  params: BoxParams,
  design: Design,
): FaceCanvases {
  const { length, width, height, flute } = params;
  const { substrate, process, brand, logo, logoScale } = design;
  const {
    logo: logoColor,
    brand: brandColor,
    marks: marksColor,
  } = design.colors;
  const logoInksKey = design.logoInks?.join(",") ?? "";

  return useMemo(() => {
    const specs = faceSpecs({ length, width, height, flute });
    const d: Design = {
      substrate,
      process,
      brand,
      logo,
      logoScale,
      colors: { logo: logoColor, brand: brandColor, marks: marksColor },
      logoInks: logoInksKey ? logoInksKey.split(",") : null,
    };
    const out = {} as FaceCanvases;
    for (const id of Object.keys(specs) as FaceId[])
      out[id] = drawFace(specs[id], d);
    return out;
  }, [
    length,
    width,
    height,
    flute,
    substrate,
    process,
    brand,
    logo,
    logoScale,
    logoColor,
    brandColor,
    marksColor,
    logoInksKey,
  ]);
}
