import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { BoxParams, Design, FaceId } from "../box/types";
import { faceSpecs } from "../box/faces";
import { drawFace } from "./drawFace";

export type FaceTextures = Record<FaceId, CanvasTexture>;

export function useFaceTextures(
  params: BoxParams,
  design: Design,
): FaceTextures {
  const { length, width, height, flute } = params;
  const { substrate, process, brand, logo, logoScale } = design;
  const {
    logo: logoColor,
    brand: brandColor,
    marks: marksColor,
  } = design.colors;

  const textures = useMemo(() => {
    const specs = faceSpecs({ length, width, height, flute });
    const d: Design = {
      substrate,
      process,
      brand,
      logo,
      logoScale,
      colors: { logo: logoColor, brand: brandColor, marks: marksColor },
    };
    const out = {} as FaceTextures;
    for (const id of Object.keys(specs) as FaceId[]) {
      const tex = new CanvasTexture(drawFace(specs[id], d));
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 8;
      out[id] = tex;
    }
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
  ]);

  useEffect(
    () => () => Object.values(textures).forEach((t) => t.dispose()),
    [textures],
  );

  return textures;
}
