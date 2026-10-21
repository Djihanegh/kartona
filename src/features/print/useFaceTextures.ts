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
  const { substrate, brand, inkColor } = design;

  const textures = useMemo(() => {
    const specs = faceSpecs({ length, width, height, flute, fold: 1 });
    const out = {} as FaceTextures;
    for (const id of Object.keys(specs) as FaceId[]) {
      const tex = new CanvasTexture(
        drawFace(specs[id], { substrate, brand, inkColor }),
      );
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 8;
      out[id] = tex;
    }
    return out;
    // On ne redessine pas pendant le pliage : seules les dimensions et le design comptent
  }, [length, width, height, flute, substrate, brand, inkColor]);

  // Libère la mémoire du GPU quand les textures sont remplacées
  useEffect(
    () => () => Object.values(textures).forEach((t) => t.dispose()),
    [textures],
  );

  return textures;
}
